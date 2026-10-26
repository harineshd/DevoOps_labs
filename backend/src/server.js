const express = require('express');
const cors = require('cors');
const os = require('os');
const { pool, initDB } = require('./db');
const { getClusterStatus, simulateChaos } = require('./k8s-monitor');

const app = express();
const PORT = process.env.PORT || 5000;
const APP_VERSION = process.env.APP_VERSION || 'v1.0.0';

let totalRequests = 0;
const serverStartTime = Date.now();

// Middleware
app.use(cors());
app.use(express.json());

// Request logger & counter middleware
app.use((req, res, next) => {
  totalRequests++;
  res.setHeader('X-Served-By-Pod', os.hostname());
  res.setHeader('X-App-Version', APP_VERSION);
  next();
});

// ==========================================
// KUBERNETES MONITORING & CLUSTER ENDPOINTS
// ==========================================

// Full Cluster & Pods Monitoring (Pod health, deployments, events, metrics)
app.get('/api/k8s/cluster-status', async (req, res) => {
  try {
    const status = await getClusterStatus();
    res.json(status);
  } catch (err) {
    console.error('Error getting cluster status:', err);
    res.status(500).json({ error: 'Failed to fetch cluster status', details: err.message });
  }
});

// Chaos Simulator Endpoint (Test CrashLoopBackOff, Unhealthy, Self-Heal in Demo)
app.post('/api/k8s/chaos', (req, res) => {
  const { podName, action } = req.body;
  if (!action) {
    return res.status(400).json({ error: 'action is required (crashloop, unhealthy, heal, heal-all)' });
  }
  const result = simulateChaos(podName, action);
  res.json(result);
});


// ==========================================
// KUBERNETES TELEMETRY & HEALTH ENDPOINTS
// ==========================================

// Liveness Probe Endpoint (Checks if process is alive)
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Readiness Probe Endpoint (Checks if DB is reachable)
app.get('/readyz', async (req, res) => {
  try {
    const dbRes = await pool.query('SELECT 1');
    res.status(200).json({
      status: 'ready',
      database: 'connected',
      pod: os.hostname(),
      uptime_seconds: Math.floor((Date.now() - serverStartTime) / 1000)
    });
  } catch (err) {
    res.status(503).json({
      status: 'not_ready',
      database: 'disconnected',
      error: err.message
    });
  }
});

// Live K8s Cluster & Pod Telemetry (Used by frontend UI demo widget)
app.get('/api/k8s-info', async (req, res) => {
  let dbStatus = 'connected';
  try {
    await pool.query('SELECT 1');
  } catch (err) {
    dbStatus = 'disconnected';
  }

  const memoryUsage = process.memoryUsage();

  res.json({
    podName: os.hostname(),
    podIp: process.env.POD_IP || req.socket.localAddress || '127.0.0.1',
    nodeName: process.env.NODE_NAME || os.hostname(),
    namespace: process.env.POD_NAMESPACE || 'streamflix',
    version: APP_VERSION,
    uptimeSeconds: Math.floor((Date.now() - serverStartTime) / 1000),
    totalRequestsHandled: totalRequests,
    memory: {
      rssMb: (memoryUsage.rss / 1024 / 1024).toFixed(2),
      heapUsedMb: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2),
      heapTotalMb: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2)
    },
    system: {
      platform: os.platform(),
      cpus: os.cpus().length,
      freeMemMb: (os.freemem() / 1024 / 1024).toFixed(2),
      totalMemMb: (os.totalmem() / 1024 / 1024).toFixed(2)
    },
    databaseStatus: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Stress testing endpoint to trigger HPA (Horizontal Pod Autoscaler)
app.get('/api/stress', (req, res) => {
  const durationMs = parseInt(req.query.duration || '2000', 10);
  const start = Date.now();
  
  // Burn CPU cycles
  while (Date.now() - start < durationMs) {
    Math.sqrt(Math.random() * 100000000);
  }

  res.json({
    message: `CPU stress completed on pod ${os.hostname()}`,
    podName: os.hostname(),
    stressedForMs: durationMs,
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// STREAMFLIX MOVIE & CATALOGUE API ENDPOINTS
// ==========================================

// Get all movies (supports category filtering, search, featured)
app.get('/api/movies', async (req, res) => {
  const { category, search, featured } = req.query;

  try {
    let query = `
      SELECT m.*, 
        CASE WHEN w.movie_id IS NOT NULL THEN true ELSE false END AS is_in_watchlist
      FROM movies m
      LEFT JOIN watchlist w ON m.id = w.movie_id
    `;
    const params = [];
    const conditions = [];

    if (category) {
      params.push(category);
      conditions.push(`m.category = $${params.length}`);
    }

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(m.title ILIKE $${params.length} OR m.genre ILIKE $${params.length} OR m.overview ILIKE $${params.length})`);
    }

    if (featured === 'true') {
      conditions.push(`m.is_featured = TRUE`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' AND ');
    }

    query += ` ORDER BY m.id ASC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).json({ error: 'Failed to fetch movies', details: err.message });
  }
});

// Get distinct categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query(`SELECT DISTINCT category FROM movies ORDER BY category ASC`);
    const categories = result.rows.map(r => r.category);
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get featured hero movie
app.get('/api/movies/featured', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.*, 
        CASE WHEN w.movie_id IS NOT NULL THEN true ELSE false END AS is_in_watchlist
      FROM movies m
      LEFT JOIN watchlist w ON m.id = w.movie_id
      WHERE m.is_featured = TRUE 
      LIMIT 1
    `);
    
    if (result.rows.length === 0) {
      const fallback = await pool.query(`
        SELECT m.*, 
          CASE WHEN w.movie_id IS NOT NULL THEN true ELSE false END AS is_in_watchlist
        FROM movies m
        LEFT JOIN watchlist w ON m.id = w.movie_id
        ORDER BY m.rating DESC LIMIT 1
      `);
      return res.json(fallback.rows[0] || null);
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching featured movie:', err);
    res.status(500).json({ error: 'Failed to fetch featured movie' });
  }
});

// Get single movie by ID
app.get('/api/movies/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT m.*, 
        CASE WHEN w.movie_id IS NOT NULL THEN true ELSE false END AS is_in_watchlist
      FROM movies m
      LEFT JOIN watchlist w ON m.id = w.movie_id
      WHERE m.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching movie details:', err);
    res.status(500).json({ error: 'Failed to fetch movie' });
  }
});

// Get user watchlist
app.get('/api/watchlist', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.*, true AS is_in_watchlist, w.added_at
      FROM watchlist w
      JOIN movies m ON w.movie_id = m.id
      ORDER BY w.added_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching watchlist:', err);
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
});

// Toggle movie in watchlist (add or remove)
app.post('/api/watchlist', async (req, res) => {
  const { movieId } = req.body;
  if (!movieId) {
    return res.status(400).json({ error: 'movieId is required' });
  }

  try {
    // Check if already in watchlist
    const check = await pool.query('SELECT id FROM watchlist WHERE movie_id = $1', [movieId]);
    
    if (check.rows.length > 0) {
      // Remove from watchlist
      await pool.query('DELETE FROM watchlist WHERE movie_id = $1', [movieId]);
      res.json({ success: true, action: 'removed', movieId });
    } else {
      // Add to watchlist
      await pool.query('INSERT INTO watchlist (movie_id) VALUES ($1)', [movieId]);
      res.json({ success: true, action: 'added', movieId });
    }
  } catch (err) {
    console.error('Error modifying watchlist:', err);
    res.status(500).json({ error: 'Failed to update watchlist' });
  }
});

// Rate a movie
app.post('/api/movies/:id/rate', async (req, res) => {
  const { id } = req.params;
  const { score } = req.body;
  const userIp = req.ip || req.socket.remoteAddress || '127.0.0.1';

  if (!score || score < 1 || score > 5) {
    return res.status(400).json({ error: 'Score must be an integer between 1 and 5' });
  }

  try {
    await pool.query(
      'INSERT INTO ratings (movie_id, user_ip, score) VALUES ($1, $2, $3)',
      [id, userIp, score]
    );

    // Calculate new average
    const avgRes = await pool.query(
      'SELECT AVG(score) as avg_score, COUNT(*) as count FROM ratings WHERE movie_id = $1',
      [id]
    );

    res.json({
      success: true,
      movieId: id,
      userScore: score,
      newAverage: parseFloat(avgRes.rows[0].avg_score).toFixed(1),
      totalRatings: parseInt(avgRes.rows[0].count, 10)
    });
  } catch (err) {
    console.error('Error submitting rating:', err);
    res.status(500).json({ error: 'Failed to submit rating' });
  }
});

// Start Server
async function startServer() {
  try {
    await initDB();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`=========================================`);
      console.log(`🎬 StreamFlix Backend API is running!`);
      console.log(`🚀 Port: ${PORT}`);
      console.log(`📦 Version: ${APP_VERSION}`);
      console.log(`☸️ Pod Hostname: ${os.hostname()}`);
      console.log(`=========================================`);
    });
  } catch (err) {
    console.error('Fatal: Could not initialize database. Exiting...', err);
    process.exit(1);
  }
}

startServer();

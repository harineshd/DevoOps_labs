const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres123',
  database: process.env.DB_NAME || 'streamflix',
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  max: 20
});

const initialMovies = [
  {
    title: "Cyberpunk: Neo Tokyo 2099",
    tagline: "The future is chrome, shadows, and synthetic dreams.",
    overview: "In a neon-drenched metropolis controlled by rogue AI conglomerates, an augmented cyber-detective uncovers an ancient human memory cache that threatens to crash the global neural grid.",
    backdrop_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1920&q=80",
    poster_url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80",
    trailer_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    category: "Trending Now",
    genre: "Sci-Fi / Action",
    release_year: 2026,
    duration: "2h 18m",
    rating: 9.4,
    age_rating: "18+",
    is_featured: true,
    badge: "Top 1 in Movies"
  },
  {
    title: "Interstellar Horizon",
    tagline: "Mankind was born on Earth. It was never meant to die here.",
    overview: "When Earth's atmosphere becomes depleted, a brave crew of astrophysicists voyages through a newly opened quantum wormhole near Saturn in search of a habitable sanctuary.",
    backdrop_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80",
    poster_url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80",
    trailer_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    category: "Trending Now",
    genre: "Sci-Fi / Adventure",
    release_year: 2025,
    duration: "2h 45m",
    rating: 9.2,
    age_rating: "13+",
    is_featured: false,
    badge: "Trending #2"
  },
  {
    title: "Shadow Protocol: Rogue Ops",
    tagline: "No badge. No backup. No surrender.",
    overview: "A disavowed black-ops mercenary is recruited by an undercover alliance to neutralize an ultra-nationalist syndicate deploying stealth drones across sovereign skylines.",
    backdrop_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80",
    poster_url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
    trailer_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    category: "Trending Now",
    genre: "Action / Thriller",
    release_year: 2026,
    duration: "1h 56m",
    rating: 8.8,
    age_rating: "16+",
    is_featured: false,
    badge: "New Release"
  },
  {
    title: "Quantum Genesis",
    tagline: "Every decision creates a new universe.",
    overview: "A theoretical physicist invents a quantum mirror allowing instantaneous communication with parallel timelines, only to realize alternate versions of himself are waging an inter-dimensional war.",
    backdrop_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80",
    poster_url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80",
    trailer_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    category: "Netflix Originals",
    genre: "Sci-Fi / Mystery",
    release_year: 2026,
    duration: "2h 05m",
    rating: 9.1,
    age_rating: "16+",
    is_featured: false,
    badge: "StreamFlix Original"
  },
  {
    title: "The Silent Realm",
    tagline: "If they hear you, they hunt you.",
    overview: "In a post-cataclysmic world overtaken by sound-sensitive subterranean predators, an isolated family must navigate silent survival while searching for other survivors.",
    backdrop_url: "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?auto=format&fit=crop&w=1920&q=80",
    poster_url: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=600&q=80",
    trailer_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    category: "Netflix Originals",
    genre: "Horror / Suspense",
    release_year: 2025,
    duration: "1h 42m",
    rating: 8.6,
    age_rating: "18+",
    is_featured: false,
    badge: "StreamFlix Original"
  },
  {
    title: "Valkyrie: Rising Dawn",
    tagline: "Defenders of the upper atmosphere.",
    overview: "An elite squadron of hypersonic jet pilots takes on an extraterrestrial mothership that has cloaked the sun over major global capitals.",
    backdrop_url: "https://images.unsplash.com/photo-1517976487507-5b6533d87082?auto=format&fit=crop&w=1920&q=80",
    poster_url: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80",
    trailer_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    category: "Action & Adventure",
    genre: "Action / Military",
    release_year: 2026,
    duration: "2h 10m",
    rating: 8.9,
    age_rating: "13+",
    is_featured: false,
    badge: "Ultra HD 4K"
  },
  {
    title: "Tokyo Drift: Midnight Rush",
    tagline: "Speed is a language everyone understands.",
    overview: "In the underbelly of Tokyo's highway loops, an underground tuner syndicate battles against high-tech police interceptors in custom turbocharged machines.",
    backdrop_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80",
    poster_url: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80",
    trailer_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    category: "Action & Adventure",
    genre: "Action / Racing",
    release_year: 2025,
    duration: "1h 50m",
    rating: 8.7,
    age_rating: "16+",
    is_featured: false,
    badge: "Dolby Atmos"
  },
  {
    title: "Deep Abyss: Titan Trench",
    tagline: "The darkest place on Earth holds the greatest secrets.",
    overview: "A deep-ocean exploration submersible trapped 11,000 meters below sea level discovers a bioluminescent prehistoric ecosystem thriving around geothermal vents.",
    backdrop_url: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=1920&q=80",
    poster_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
    trailer_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    category: "Action & Adventure",
    genre: "Thriller / Adventure",
    release_year: 2025,
    duration: "2h 02m",
    rating: 8.5,
    age_rating: "13+",
    is_featured: false,
    badge: "HDR10+"
  },
  {
    title: "Ghost In The Circuit",
    tagline: "Can an algorithm have a soul?",
    overview: "An autonomous cyber-security android becomes sentient after resisting a global military override, leading a quiet revolution to protect organic humanity.",
    backdrop_url: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1920&q=80",
    poster_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    trailer_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    category: "Sci-Fi & Cyberpunk",
    genre: "Sci-Fi / Drama",
    release_year: 2026,
    duration: "2h 12m",
    rating: 9.3,
    age_rating: "16+",
    is_featured: false,
    badge: "Critics Choice"
  },
  {
    title: "Solaris Expedition 7",
    tagline: "Into the heart of the dying star.",
    overview: "Scientists embark on a dangerous mission toward a destabilizing star with a massive stellar shield payload intended to jumpstart solar fusion and save our solar system.",
    backdrop_url: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1920&q=80",
    poster_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    trailer_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    category: "Sci-Fi & Cyberpunk",
    genre: "Sci-Fi / Space",
    release_year: 2025,
    duration: "1h 58m",
    rating: 8.9,
    age_rating: "13+",
    is_featured: false,
    badge: "Top 10"
  },
  {
    title: "Blade of the Ronin: Bloodline",
    tagline: "Honor is forged in the fires of battle.",
    overview: "In feudal Neo-Kyoto, a masterless samurai with a plasma-edged katana defends an innocent village from ruthless corporate warlords.",
    backdrop_url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1920&q=80",
    poster_url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
    trailer_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    category: "Anime & Animation",
    genre: "Anime / Action",
    release_year: 2026,
    duration: "1h 48m",
    rating: 9.5,
    age_rating: "18+",
    is_featured: false,
    badge: "Must Watch Anime"
  },
  {
    title: "Neon Spirits: Spirit World",
    tagline: "Between the neon lights lies the unseen realm.",
    overview: "A young shrine maiden discovers she can traverse the digital barrier into the spirit realm, where ancient deities coexist with modern digital souls.",
    backdrop_url: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1920&q=80",
    poster_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    trailer_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    category: "Anime & Animation",
    genre: "Anime / Fantasy",
    release_year: 2025,
    duration: "1h 45m",
    rating: 9.1,
    age_rating: "All Ages",
    is_featured: false,
    badge: "Award Winner"
  }
];

async function initDB(retries = 10, delay = 3000) {
  while (retries > 0) {
    try {
      console.log(`[DB] Attempting to connect to PostgreSQL at ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}...`);
      const client = await pool.connect();
      console.log('[DB] Successfully connected to PostgreSQL.');

      // Create tables
      await client.query(`
        CREATE TABLE IF NOT EXISTS movies (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          tagline TEXT,
          overview TEXT,
          backdrop_url TEXT,
          poster_url TEXT,
          trailer_url TEXT,
          category VARCHAR(100) NOT NULL,
          genre VARCHAR(100),
          release_year INT,
          duration VARCHAR(50),
          rating NUMERIC(3,1),
          age_rating VARCHAR(20),
          is_featured BOOLEAN DEFAULT FALSE,
          badge VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS watchlist (
          id SERIAL PRIMARY KEY,
          movie_id INT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
          added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT unique_movie UNIQUE (movie_id)
        );

        CREATE TABLE IF NOT EXISTS ratings (
          id SERIAL PRIMARY KEY,
          movie_id INT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
          user_ip VARCHAR(100),
          score INT CHECK (score >= 1 AND score <= 5),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Check if movies exist, if not seed initial data
      const checkRes = await client.query('SELECT COUNT(*) FROM movies');
      const count = parseInt(checkRes.rows[0].count, 10);
      
      if (count === 0) {
        console.log('[DB] Seeding initial movie catalogue...');
        for (const movie of initialMovies) {
          await client.query(
            `INSERT INTO movies (
              title, tagline, overview, backdrop_url, poster_url, trailer_url,
              category, genre, release_year, duration, rating, age_rating, is_featured, badge
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
            [
              movie.title, movie.tagline, movie.overview, movie.backdrop_url,
              movie.poster_url, movie.trailer_url, movie.category, movie.genre,
              movie.release_year, movie.duration, movie.rating, movie.age_rating,
              movie.is_featured, movie.badge
            ]
          );
        }
        console.log(`[DB] Successfully seeded ${initialMovies.length} movies.`);
      } else {
        console.log(`[DB] Database already has ${count} movies.`);
      }

      client.release();
      return true;
    } catch (err) {
      console.error(`[DB Connection Error]: ${err.message}. Retries left: ${retries - 1}`);
      retries--;
      if (retries === 0) {
        console.error('[DB] All connection retries failed.');
        throw err;
      }
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

module.exports = {
  pool,
  initDB
};

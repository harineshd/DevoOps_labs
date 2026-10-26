const fs = require('fs');
const https = require('https');
const os = require('os');

// In-Cluster ServiceAccount paths
const SA_TOKEN_PATH = '/var/run/secrets/kubernetes.io/serviceaccount/token';
const SA_CA_PATH = '/var/run/secrets/kubernetes.io/serviceaccount/ca.crt';
const K8S_HOST = process.env.KUBERNETES_SERVICE_HOST || 'kubernetes.default.svc';
const K8S_PORT = process.env.KUBERNETES_SERVICE_PORT || '443';
const NAMESPACE = process.env.POD_NAMESPACE || 'streamflix';

// In-memory simulated cluster state (for local dev, Docker Compose, or chaos testing)
let chaosOverrides = {};
let simulatedRestarts = {
  'streamflix-backend-78b9c45f-1': 0,
  'streamflix-backend-78b9c45f-2': 0,
  'streamflix-frontend-54d98a2e-1': 0,
  'streamflix-frontend-54d98a2e-2': 0,
  'streamflix-postgres-db-0': 0
};

// Check if running inside real K8s cluster
function isInCluster() {
  return fs.existsSync(SA_TOKEN_PATH) && fs.existsSync(SA_CA_PATH);
}

// Make HTTPS request to in-cluster K8s API server
function callK8sApi(path) {
  return new Promise((resolve, reject) => {
    try {
      const token = fs.readFileSync(SA_TOKEN_PATH, 'utf8').trim();
      const ca = fs.readFileSync(SA_CA_PATH);

      const options = {
        hostname: K8S_HOST,
        port: K8S_PORT,
        path: path,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        },
        ca: ca,
        timeout: 4000
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(e);
            }
          } else {
            reject(new Error(`K8s API responded with status ${res.statusCode}: ${data}`));
          }
        });
      });

      req.on('error', (err) => reject(err));
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('K8s API request timed out'));
      });
      req.end();
    } catch (err) {
      reject(err);
    }
  });
}

// Helper to determine pod color and status
function getPodStatus(pod) {
  const name = pod.name;
  if (chaosOverrides[name]) {
    return chaosOverrides[name];
  }

  // Real or simulated phase check
  const phase = pod.phase || 'Running';
  const reason = pod.reason || '';

  if (reason === 'CrashLoopBackOff' || phase === 'CrashLoopBackOff') {
    return {
      statusColor: 'orange',
      statusLabel: 'CrashLoopBackOff',
      phase: 'CrashLoopBackOff',
      ready: '0/1',
      description: 'Container crashed and is in exponential restart backoff'
    };
  }

  if (phase === 'Pending' || reason === 'ContainerCreating') {
    return {
      statusColor: 'orange',
      statusLabel: 'Pending',
      phase: 'Pending',
      ready: '0/1',
      description: 'Pod is waiting to be scheduled or pulling container image'
    };
  }

  if (phase === 'Failed' || phase === 'Error' || reason === 'OOMKilled' || reason === 'Error') {
    return {
      statusColor: 'red',
      statusLabel: 'Unhealthy / Error',
      phase: 'Failed',
      ready: '0/1',
      description: 'Container failed liveness probe or encountered fatal exit'
    };
  }

  if (phase === 'Terminating') {
    return {
      statusColor: 'red',
      statusLabel: 'Terminating',
      phase: 'Terminating',
      ready: '0/1',
      description: 'Pod is gracefully shutting down'
    };
  }

  return {
    statusColor: 'green',
    statusLabel: 'Healthy',
    phase: 'Running',
    ready: '1/1',
    description: 'All containers running and passing readiness/liveness probes'
  };
}

// Get cluster monitoring state (real K8s API with realistic simulated fallback)
async function getClusterStatus() {
  const currentPodName = os.hostname();

  if (isInCluster()) {
    try {
      // Query real K8s API
      const [podsData, deploysData, eventsData] = await Promise.all([
        callK8sApi(`/api/v1/namespaces/${NAMESPACE}/pods`),
        callK8sApi(`/apis/apps/v1/namespaces/${NAMESPACE}/deployments`),
        callK8sApi(`/api/v1/namespaces/${NAMESPACE}/events?limit=20`)
      ]);

      const pods = (podsData.items || []).map((item) => {
        const name = item.metadata.name;
        const phase = item.status.phase;
        const containerStatuses = item.status.containerStatuses || [];
        const isReady = containerStatuses.every(c => c.ready) && containerStatuses.length > 0;
        const restartCount = containerStatuses.reduce((sum, c) => sum + c.restartCount, 0);
        
        let reason = '';
        if (containerStatuses.length > 0 && containerStatuses[0].state?.waiting) {
          reason = containerStatuses[0].state.waiting.reason || '';
        }

        const statusInfo = getPodStatus({ name, phase: reason || phase, reason });

        const tier = name.includes('frontend') ? 'frontend' : name.includes('backend') ? 'backend' : 'database';
        const startTime = item.status.startTime ? new Date(item.status.startTime) : new Date();
        const ageSec = Math.floor((Date.now() - startTime.getTime()) / 1000);
        const ageFormatted = ageSec < 60 ? `${ageSec}s` : `${Math.floor(ageSec / 60)}m ${ageSec % 60}s`;

        return {
          name,
          tier,
          isCurrentPod: name === currentPodName,
          statusColor: statusInfo.statusColor,
          statusLabel: statusInfo.statusLabel,
          phase: statusInfo.phase,
          ready: isReady ? '1/1' : statusInfo.ready,
          restarts: restartCount,
          ip: item.status.podIP || 'Pending',
          node: item.spec.nodeName || 'k8s-node',
          age: ageFormatted,
          cpuUsage: tier === 'backend' ? '112m / 500m' : tier === 'frontend' ? '42m / 250m' : '78m / 500m',
          cpuPercent: tier === 'backend' ? 22 : tier === 'frontend' ? 16 : 15,
          memoryUsage: tier === 'backend' ? '142Mi / 256Mi' : tier === 'frontend' ? '54Mi / 128Mi' : '186Mi / 512Mi',
          memoryPercent: tier === 'backend' ? 55 : tier === 'frontend' ? 42 : 36,
          description: statusInfo.description
        };
      });

      const deployments = (deploysData.items || []).map((item) => {
        const desired = item.spec.replicas || 1;
        const ready = item.status.readyReplicas || 0;
        const updated = item.status.updatedReplicas || 0;
        const isHealthy = ready === desired;

        return {
          name: item.metadata.name,
          desiredReplicas: desired,
          readyReplicas: ready,
          updatedReplicas: updated,
          status: isHealthy ? 'Healthy' : 'Degraded',
          statusColor: isHealthy ? 'green' : 'orange',
          strategy: item.spec.strategy?.type || 'RollingUpdate',
          image: item.spec.template.spec.containers[0]?.image || 'streamflix',
          hpa: item.metadata.name === 'streamflix-backend' ? '2-6 Replicas (CPU 50%)' : 'Manual'
        };
      });

      const events = (eventsData.items || []).slice(0, 10).map((e) => ({
        type: e.type || 'Normal',
        reason: e.reason,
        message: e.message,
        object: e.involvedObject?.kind ? `${e.involvedObject.kind}/${e.involvedObject.name}` : 'Pod',
        timestamp: e.lastTimestamp || e.eventTime || new Date().toISOString()
      }));

      return {
        mode: 'in-cluster-k8s',
        namespace: NAMESPACE,
        activeNode: os.hostname(),
        clusterHealthScore: calculateHealthScore(pods),
        summary: getSummaryCounts(pods),
        pods,
        deployments,
        events
      };
    } catch (k8sErr) {
      console.warn('[K8s-Monitor] Real K8s API query failed, falling back to dynamic simulated state:', k8sErr.message);
    }
  }

  // Realistic dynamic cluster representation for local / docker / demo testing
  return generateSimulatedClusterState(currentPodName);
}

function generateSimulatedClusterState(currentPodName) {
  const podList = [
    {
      name: currentPodName.startsWith('streamflix') ? currentPodName : `streamflix-backend-${currentPodName.slice(0, 6) || '78b9c45f'}-1`,
      tier: 'backend',
      isCurrentPod: true,
      rawRestarts: simulatedRestarts['streamflix-backend-78b9c45f-1'] || 0,
      ip: '10.244.0.24',
      node: 'k8s-worker-node-1',
      age: '18m 42s',
      cpuUsage: '94m / 500m',
      cpuPercent: 18,
      memoryUsage: '148Mi / 256Mi',
      memoryPercent: 57
    },
    {
      name: `streamflix-backend-78b9c45f-2`,
      tier: 'backend',
      isCurrentPod: false,
      rawRestarts: simulatedRestarts['streamflix-backend-78b9c45f-2'] || 0,
      ip: '10.244.1.18',
      node: 'k8s-worker-node-2',
      age: '18m 40s',
      cpuUsage: '88m / 500m',
      cpuPercent: 17,
      memoryUsage: '136Mi / 256Mi',
      memoryPercent: 53
    },
    {
      name: `streamflix-frontend-54d98a2e-1`,
      tier: 'frontend',
      isCurrentPod: false,
      rawRestarts: simulatedRestarts['streamflix-frontend-54d98a2e-1'] || 0,
      ip: '10.244.0.25',
      node: 'k8s-worker-node-1',
      age: '19m 10s',
      cpuUsage: '38m / 250m',
      cpuPercent: 15,
      memoryUsage: '52Mi / 128Mi',
      memoryPercent: 40
    },
    {
      name: `streamflix-frontend-54d98a2e-2`,
      tier: 'frontend',
      isCurrentPod: false,
      rawRestarts: simulatedRestarts['streamflix-frontend-54d98a2e-2'] || 0,
      ip: '10.244.1.19',
      node: 'k8s-worker-node-2',
      age: '19m 08s',
      cpuUsage: '34m / 250m',
      cpuPercent: 13,
      memoryUsage: '48Mi / 128Mi',
      memoryPercent: 37
    },
    {
      name: `streamflix-postgres-db-0`,
      tier: 'database',
      isCurrentPod: false,
      rawRestarts: simulatedRestarts['streamflix-postgres-db-0'] || 0,
      ip: '10.244.0.12',
      node: 'k8s-worker-node-1',
      age: '24m 15s',
      cpuUsage: '72m / 500m',
      cpuPercent: 14,
      memoryUsage: '178Mi / 512Mi',
      memoryPercent: 34
    }
  ];

  const pods = podList.map(p => {
    const statusInfo = getPodStatus(p);
    return {
      name: p.name,
      tier: p.tier,
      isCurrentPod: p.isCurrentPod,
      statusColor: statusInfo.statusColor,
      statusLabel: statusInfo.statusLabel,
      phase: statusInfo.phase,
      ready: statusInfo.ready,
      restarts: p.rawRestarts,
      ip: p.ip,
      node: p.node,
      age: p.age,
      cpuUsage: p.cpuUsage,
      cpuPercent: p.cpuPercent,
      memoryUsage: p.memoryUsage,
      memoryPercent: p.memoryPercent,
      description: statusInfo.description
    };
  });

  const backendHealthy = pods.filter(p => p.tier === 'backend' && p.statusColor === 'green').length;
  const frontendHealthy = pods.filter(p => p.tier === 'frontend' && p.statusColor === 'green').length;
  const dbHealthy = pods.filter(p => p.tier === 'database' && p.statusColor === 'green').length;

  const deployments = [
    {
      name: 'streamflix-backend',
      desiredReplicas: 2,
      readyReplicas: backendHealthy,
      updatedReplicas: 2,
      status: backendHealthy === 2 ? 'Healthy' : 'Degraded',
      statusColor: backendHealthy === 2 ? 'green' : 'orange',
      strategy: 'RollingUpdate (maxSurge: 1, maxUnavailable: 0)',
      image: 'streamflix-backend:v1.0.0',
      hpa: '2-6 Replicas (Target CPU: 50%)'
    },
    {
      name: 'streamflix-frontend',
      desiredReplicas: 2,
      readyReplicas: frontendHealthy,
      updatedReplicas: 2,
      status: frontendHealthy === 2 ? 'Healthy' : 'Degraded',
      statusColor: frontendHealthy === 2 ? 'green' : 'orange',
      strategy: 'RollingUpdate (maxSurge: 1, maxUnavailable: 0)',
      image: 'streamflix-frontend:v1.0.0',
      hpa: 'Manual (2 Replicas)'
    },
    {
      name: 'streamflix-postgres',
      desiredReplicas: 1,
      readyReplicas: dbHealthy,
      updatedReplicas: 1,
      status: dbHealthy === 1 ? 'Healthy' : 'Degraded',
      statusColor: dbHealthy === 1 ? 'green' : 'red',
      strategy: 'Recreate (Stateful PVC attached)',
      image: 'postgres:16-alpine',
      hpa: 'Disabled (Stateful DB)'
    }
  ];

  const events = [
    {
      type: 'Normal',
      reason: 'ReadinessProbeSuccessful',
      object: 'Pod/streamflix-backend',
      message: 'Container backend passed HTTP readiness probe on /readyz',
      timestamp: new Date(Date.now() - 1000 * 20).toLocaleTimeString()
    },
    {
      type: 'Normal',
      reason: 'Started',
      object: 'Pod/streamflix-frontend',
      message: 'Started container frontend with Nginx proxy',
      timestamp: new Date(Date.now() - 1000 * 60 * 2).toLocaleTimeString()
    },
    {
      type: 'Normal',
      reason: 'Pulled',
      object: 'Pod/streamflix-backend',
      message: 'Container image streamflix-backend:v1.0.0 already present on node',
      timestamp: new Date(Date.now() - 1000 * 60 * 3).toLocaleTimeString()
    },
    {
      type: 'Normal',
      reason: 'Scheduled',
      object: 'Pod/streamflix-postgres-db-0',
      message: 'Successfully assigned streamflix/streamflix-postgres to k8s-worker-node-1',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toLocaleTimeString()
    }
  ];

  return {
    mode: 'simulated-k8s',
    namespace: NAMESPACE,
    activeNode: os.hostname(),
    clusterHealthScore: calculateHealthScore(pods),
    summary: getSummaryCounts(pods),
    pods,
    deployments,
    events
  };
}

function getSummaryCounts(pods) {
  const healthy = pods.filter(p => p.statusColor === 'green').length;
  const warning = pods.filter(p => p.statusColor === 'orange').length;
  const critical = pods.filter(p => p.statusColor === 'red').length;
  return {
    totalPods: pods.length,
    healthy,
    warning,
    critical
  };
}

function calculateHealthScore(pods) {
  if (pods.length === 0) return 100;
  const healthy = pods.filter(p => p.statusColor === 'green').length;
  return Math.round((healthy / pods.length) * 100);
}

// Chaos simulation handler
function simulateChaos(podName, action) {
  if (action === 'crashloop') {
    chaosOverrides[podName] = {
      statusColor: 'orange',
      statusLabel: 'CrashLoopBackOff',
      phase: 'CrashLoopBackOff',
      ready: '0/1',
      description: 'Back-off 40s restarting failed container: error code 137 (OOM / Exception)'
    };
    simulatedRestarts[podName] = (simulatedRestarts[podName] || 0) + 1;
  } else if (action === 'unhealthy') {
    chaosOverrides[podName] = {
      statusColor: 'red',
      statusLabel: 'Unhealthy (Probe Failed)',
      phase: 'Failed',
      ready: '0/1',
      description: 'Liveness probe failed: HTTP probe returned status code 503'
    };
    simulatedRestarts[podName] = (simulatedRestarts[podName] || 0) + 1;
  } else if (action === 'heal' || action === 'reset') {
    delete chaosOverrides[podName];
  } else if (action === 'heal-all') {
    chaosOverrides = {};
  }

  return { success: true, action, podName, currentOverrides: chaosOverrides };
}

module.exports = {
  getClusterStatus,
  simulateChaos
};

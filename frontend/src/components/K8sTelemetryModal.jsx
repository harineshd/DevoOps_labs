import React, { useState } from 'react';
import { X, Server, Activity, Cpu, Database, RefreshCw, Zap, Shield, Box, CheckCircle, AlertCircle } from 'lucide-react';

export default function K8sTelemetryModal({
  isOpen,
  onClose,
  k8sInfo,
  onRefreshK8sInfo
}) {
  const [loadBalancingLog, setLoadBalancingLog] = useState([]);
  const [testingLoad, setTestingLoad] = useState(false);
  const [stressingCpu, setStressingCpu] = useState(false);
  const [stressResult, setStressResult] = useState(null);

  if (!isOpen) return null;

  // Simulate 10 rapid API requests to demonstrate K8s Service round-robin load balancing
  const runLoadBalanceTest = async () => {
    setTestingLoad(true);
    setLoadBalancingLog([]);
    const results = [];

    for (let i = 1; i <= 10; i++) {
      try {
        const start = performance.now();
        const res = await fetch('/api/k8s-info');
        const data = await res.json();
        const latency = Math.round(performance.now() - start);

        results.push({
          reqNum: i,
          podName: data.podName || 'local-pod',
          podIp: data.podIp || '127.0.0.1',
          latency: `${latency}ms`,
          status: res.status
        });
        setLoadBalancingLog([...results]);
      } catch (err) {
        results.push({
          reqNum: i,
          podName: 'Error connecting',
          podIp: '-',
          latency: '-',
          status: 500
        });
        setLoadBalancingLog([...results]);
      }
      // slight delay between requests
      await new Promise(r => setTimeout(r, 100));
    }
    setTestingLoad(false);
  };

  // Trigger CPU load to demonstrate Horizontal Pod Autoscaler
  const triggerCpuStress = async () => {
    setStressingCpu(true);
    setStressResult(null);
    try {
      const res = await fetch('/api/stress?duration=3000');
      const data = await res.json();
      setStressResult(data);
    } catch (err) {
      setStressResult({ error: err.message });
    } finally {
      setStressingCpu(false);
    }
  };

  // Calculate unique pod distribution from test
  const podDistribution = loadBalancingLog.reduce((acc, curr) => {
    acc[curr.podName] = (acc[curr.podName] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#141820] text-white rounded-2xl shadow-2xl border border-cyan-500/30 overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-950/80 via-indigo-950/80 to-purple-950/80 border-b border-cyan-500/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-400">
              <Box className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>Kubernetes Live Pod Telemetry</span>
                <span className="text-[11px] bg-cyan-500/20 text-cyan-300 font-mono px-2 py-0.5 rounded-full border border-cyan-500/30">
                  Cluster Active
                </span>
              </h2>
              <p className="text-xs text-zinc-400">Real-time pod replica inspection & demo tools</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onRefreshK8sInfo}
              className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
              title="Refresh Cluster Info"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6">
          {/* Main Pod Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800">
              <span className="text-xs text-zinc-400 flex items-center space-x-1 mb-1">
                <Server className="w-3.5 h-3.5 text-cyan-400" />
                <span>Active Pod</span>
              </span>
              <p className="font-mono text-xs sm:text-sm font-bold text-cyan-300 truncate" title={k8sInfo?.podName}>
                {k8sInfo?.podName || 'N/A'}
              </p>
            </div>

            <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800">
              <span className="text-xs text-zinc-400 flex items-center space-x-1 mb-1">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pod IP</span>
              </span>
              <p className="font-mono text-xs sm:text-sm font-bold text-emerald-300 truncate">
                {k8sInfo?.podIp || '127.0.0.1'}
              </p>
            </div>

            <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800">
              <span className="text-xs text-zinc-400 flex items-center space-x-1 mb-1">
                <Database className="w-3.5 h-3.5 text-amber-400" />
                <span>Postgres DB</span>
              </span>
              <p className="text-xs sm:text-sm font-bold flex items-center space-x-1 text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{k8sInfo?.databaseStatus || 'Connected'}</span>
              </p>
            </div>

            <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800">
              <span className="text-xs text-zinc-400 flex items-center space-x-1 mb-1">
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                <span>App Version</span>
              </span>
              <p className="font-mono text-xs sm:text-sm font-bold text-purple-300">
                {k8sInfo?.version || 'v1.0.0'}
              </p>
            </div>
          </div>

          {/* Pod System Metrics */}
          <div className="bg-black/40 rounded-xl p-4 border border-zinc-800/80 space-y-3">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Pod Memory & Uptime Metrics</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-zinc-500 block">Memory (RSS):</span>
                <span className="font-mono font-bold text-white">{k8sInfo?.memory?.rssMb || '0'} MB</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Heap Used:</span>
                <span className="font-mono font-bold text-white">{k8sInfo?.memory?.heapUsedMb || '0'} MB</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Pod Uptime:</span>
                <span className="font-mono font-bold text-emerald-400">{k8sInfo?.uptimeSeconds || '0'} seconds</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Total Requests Handled:</span>
                <span className="font-mono font-bold text-cyan-400">{k8sInfo?.totalRequestsHandled || '0'}</span>
              </div>
            </div>
          </div>

          {/* Interactive Demo Action 1: Kubernetes Service Load Balancing */}
          <div className="bg-zinc-900/90 rounded-xl p-4 border border-cyan-500/20 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span>K8s Service Load Balancing Demo</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Sends 10 concurrent requests to test round-robin load distribution across backend pod replicas.
                </p>
              </div>
              <button
                onClick={runLoadBalanceTest}
                disabled={testingLoad}
                className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-zinc-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-md flex items-center justify-center space-x-1.5"
              >
                {testingLoad ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Testing Replicas...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Run Replica Test (10x)</span>
                  </>
                )}
              </button>
            </div>

            {/* Load Balancing Results Distribution */}
            {Object.keys(podDistribution).length > 0 && (
              <div className="pt-2 border-t border-zinc-800 space-y-2">
                <div className="text-xs text-zinc-400 font-semibold">Pod Traffic Distribution:</div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(podDistribution).map(([pod, count]) => (
                    <div key={pod} className="bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs px-3 py-1 rounded-md font-mono flex items-center space-x-2">
                      <span className="font-bold">{pod}:</span>
                      <span className="bg-cyan-500/30 px-1.5 py-0.2 rounded text-[11px] font-bold text-white">
                        {count} requests ({count * 10}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Request Table Log */}
            {loadBalancingLog.length > 0 && (
              <div className="max-h-36 overflow-y-auto no-scrollbar rounded-lg border border-zinc-800 bg-black/60 text-[11px] font-mono">
                <table className="w-full text-left">
                  <thead className="bg-zinc-800/80 text-zinc-400 sticky top-0">
                    <tr>
                      <th className="p-1.5 pl-3">Req #</th>
                      <th className="p-1.5">Responded Pod</th>
                      <th className="p-1.5">Pod IP</th>
                      <th className="p-1.5">Latency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {loadBalancingLog.map((log) => (
                      <tr key={log.reqNum} className="hover:bg-zinc-800/40">
                        <td className="p-1.5 pl-3 text-zinc-500">#{log.reqNum}</td>
                        <td className="p-1.5 text-cyan-300 font-bold">{log.podName}</td>
                        <td className="p-1.5 text-zinc-400">{log.podIp}</td>
                        <td className="p-1.5 text-emerald-400">{log.latency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Interactive Demo Action 2: HPA CPU Stress Tester */}
          <div className="bg-zinc-900/90 rounded-xl p-4 border border-rose-500/20 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-rose-400" />
                  <span>Horizontal Pod Autoscaler (HPA) CPU Spike Simulator</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Simulates intense CPU workload on the active pod to trigger K8s auto-scaling.
                </p>
              </div>
              <button
                onClick={triggerCpuStress}
                disabled={stressingCpu}
                className="bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-md flex items-center justify-center space-x-1.5"
              >
                {stressingCpu ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Burning CPU...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Trigger CPU Load (3s)</span>
                  </>
                )}
              </button>
            </div>

            {stressResult && (
              <div className="p-2.5 bg-rose-950/40 border border-rose-500/30 rounded-lg text-xs font-mono text-rose-300">
                ✓ CPU stress test completed on pod: <span className="font-bold text-white">{stressResult.podName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-black/40 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
          <span>StreamFlix Cloud Native 3-Tier K8s Demo App</span>
          <span className="font-mono">Namespace: {k8sInfo?.namespace || 'default'}</span>
        </div>
      </div>
    </div>
  );
}

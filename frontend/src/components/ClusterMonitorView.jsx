import React, { useState, useEffect } from 'react';
import { 
  Server, Activity, Box, Cpu, HardDrive, RefreshCw, AlertTriangle, 
  CheckCircle2, XCircle, Clock, ShieldCheck, Flame, Zap, Layers, Play, 
  RotateCcw, Sparkles
} from 'lucide-react';

export default function ClusterMonitorView() {
  const [clusterData, setClusterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(2000); // 2s polling
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [actionLoading, setActionLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all'); // all, green, orange, red

  const fetchClusterStatus = async () => {
    try {
      const res = await fetch('/api/k8s/cluster-status');
      if (res.ok) {
        const data = await res.json();
        setClusterData(data);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.warn('Error fetching cluster monitoring status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClusterStatus();
    if (autoRefreshInterval > 0) {
      const timer = setInterval(fetchClusterStatus, autoRefreshInterval);
      return () => clearInterval(timer);
    }
  }, [autoRefreshInterval]);

  const handleChaosAction = async (podName, action) => {
    setActionLoading(true);
    try {
      await fetch('/api/k8s/chaos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ podName, action })
      });
      await fetchClusterStatus();
    } catch (err) {
      console.error('Failed to trigger chaos action:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (color, label) => {
    if (color === 'green') {
      return (
        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/50 shadow-sm shadow-emerald-900/30">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>{label || 'Healthy'}</span>
        </span>
      );
    }
    if (color === 'orange') {
      return (
        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-950/80 text-amber-400 border border-amber-500/50 shadow-sm shadow-amber-900/30 animate-pulse">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{label || 'CrashLoopBackOff'}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-950/80 text-rose-400 border border-rose-500/50 shadow-sm shadow-rose-900/30 animate-pulse">
        <XCircle className="w-3.5 h-3.5" />
        <span>{label || 'Unhealthy / Error'}</span>
      </span>
    );
  };

  const filteredPods = clusterData?.pods?.filter(pod => {
    if (statusFilter === 'all') return true;
    return pod.statusColor === statusFilter;
  }) || [];

  return (
    <div className="pt-24 pb-16 px-4 md:px-12 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-700 text-white shadow-lg shadow-cyan-900/30">
              <Box className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center space-x-3">
                <span>Kubernetes Live Cluster Monitor</span>
                <span className="text-xs font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/40 px-2.5 py-0.5 rounded-full">
                  Namespace: {clusterData?.namespace || 'streamflix'}
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400">
                Real-time Pod state, deployment health, service telemetry & chaos resilience testing
              </p>
            </div>
          </div>
        </div>

        {/* Controls & Refresh Rate */}
        <div className="flex items-center space-x-3 self-start md:self-auto">
          <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded-lg p-1 text-xs">
            <span className="text-zinc-400 px-2 font-medium">Refresh:</span>
            {[
              { label: '1s', val: 1000 },
              { label: '2s', val: 2000 },
              { label: '5s', val: 5000 },
              { label: 'Off', val: 0 }
            ].map(item => (
              <button
                key={item.label}
                onClick={() => setAutoRefreshInterval(item.val)}
                className={`px-2 py-1 rounded transition-colors ${
                  autoRefreshInterval === item.val
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={fetchClusterStatus}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-zinc-300 hover:text-white transition-colors"
            title="Manual Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Top Metric / Health Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cluster Health Score */}
        <div className="bg-[#181a20] p-4 rounded-xl border border-zinc-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Cluster Health</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white">
              {clusterData?.clusterHealthScore || 100}%
            </span>
            <span className="text-xs text-emerald-400 font-semibold">
              {clusterData?.summary?.healthy} / {clusterData?.summary?.totalPods} Pods Online
            </span>
          </div>
          <div className="mt-3 w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                (clusterData?.clusterHealthScore || 100) > 80
                  ? 'bg-emerald-500'
                  : (clusterData?.clusterHealthScore || 100) > 50
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${clusterData?.clusterHealthScore || 100}%` }}
            ></div>
          </div>
        </div>

        {/* Pod Status Counts */}
        <div className="bg-[#181a20] p-4 rounded-xl border border-zinc-800">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
            Pod State Breakdown
          </span>
          <div className="grid grid-cols-3 gap-2 text-center">
            <button 
              onClick={() => setStatusFilter(statusFilter === 'green' ? 'all' : 'green')}
              className={`p-1.5 rounded-lg border transition-all ${
                statusFilter === 'green' ? 'bg-emerald-950 border-emerald-400' : 'bg-zinc-900/60 border-zinc-800 hover:border-emerald-500/40'
              }`}
            >
              <span className="text-xs text-emerald-400 block font-bold">🟢 Healthy</span>
              <span className="text-lg font-black text-white">{clusterData?.summary?.healthy || 0}</span>
            </button>

            <button 
              onClick={() => setStatusFilter(statusFilter === 'orange' ? 'all' : 'orange')}
              className={`p-1.5 rounded-lg border transition-all ${
                statusFilter === 'orange' ? 'bg-amber-950 border-amber-400' : 'bg-zinc-900/60 border-zinc-800 hover:border-amber-500/40'
              }`}
            >
              <span className="text-xs text-amber-400 block font-bold">🟠 Warning</span>
              <span className="text-lg font-black text-white">{clusterData?.summary?.warning || 0}</span>
            </button>

            <button 
              onClick={() => setStatusFilter(statusFilter === 'red' ? 'all' : 'red')}
              className={`p-1.5 rounded-lg border transition-all ${
                statusFilter === 'red' ? 'bg-rose-950 border-rose-400' : 'bg-zinc-900/60 border-zinc-800 hover:border-rose-500/40'
              }`}
            >
              <span className="text-xs text-rose-400 block font-bold">🔴 Critical</span>
              <span className="text-lg font-black text-white">{clusterData?.summary?.critical || 0}</span>
            </button>
          </div>
        </div>

        {/* Deployments Ready */}
        <div className="bg-[#181a20] p-4 rounded-xl border border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Deployments</span>
            <Layers className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white">
              {clusterData?.deployments?.filter(d => d.status === 'Healthy').length || 0} / {clusterData?.deployments?.length || 3}
            </span>
            <span className="text-xs text-cyan-400 font-semibold">Active Services</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-2 truncate">
            Frontend (2) • Backend (2) • Postgres (1)
          </p>
        </div>

        {/* Live Active Node & Mode */}
        <div className="bg-[#181a20] p-4 rounded-xl border border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Connected Node</span>
            <Server className="w-5 h-5 text-purple-400" />
          </div>
          <div className="mt-2">
            <span className="font-mono text-sm font-bold text-purple-300 truncate block">
              {clusterData?.activeNode || 'minikube-node-1'}
            </span>
            <span className="text-xs text-zinc-500 flex items-center space-x-1 mt-1">
              <Clock className="w-3 h-3" />
              <span>Synced: {lastUpdated.toLocaleTimeString()}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Demo Chaos & Resilience Bar */}
      <div className="bg-gradient-to-r from-zinc-900 via-[#1a1e28] to-zinc-900 p-4 rounded-xl border border-cyan-500/30 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Live Demonstration Chaos & Self-Healing Controls</span>
          </h3>
          <p className="text-xs text-zinc-400">
            Click these buttons during your presentation to demonstrate how Kubernetes detects errors and transitions pod status colors live on screen!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleChaosAction('streamflix-backend-78b9c45f-1', 'crashloop')}
            disabled={actionLoading}
            className="px-3 py-1.5 bg-amber-950/70 hover:bg-amber-900 border border-amber-500/60 text-amber-300 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Simulate CrashLoopBackOff (Orange)</span>
          </button>

          <button
            onClick={() => handleChaosAction('streamflix-backend-78b9c45f-2', 'unhealthy')}
            disabled={actionLoading}
            className="px-3 py-1.5 bg-rose-950/70 hover:bg-rose-900 border border-rose-500/60 text-rose-300 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Simulate Pod Error / Probe Fail (Red)</span>
          </button>

          <button
            onClick={() => handleChaosAction(null, 'heal-all')}
            disabled={actionLoading}
            className="px-3 py-1.5 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/60 text-emerald-300 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 shadow-lg shadow-emerald-900/30"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Heal All Pods (Green)</span>
          </button>
        </div>
      </div>

      {/* Live Pods Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Box className="w-5 h-5 text-cyan-400" />
            <span>Active Kubernetes Pods ({filteredPods.length})</span>
          </h2>
          {statusFilter !== 'all' && (
            <button
              onClick={() => setStatusFilter('all')}
              className="text-xs text-zinc-400 hover:text-white underline"
            >
              Clear filter (showing {statusFilter})
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPods.map((pod) => {
            const isGreen = pod.statusColor === 'green';
            const isOrange = pod.statusColor === 'orange';
            const isRed = pod.statusColor === 'red';

            return (
              <div
                key={pod.name}
                className={`bg-[#181a20] rounded-xl p-5 border transition-all duration-300 relative overflow-hidden ${
                  isGreen
                    ? 'border-emerald-500/30 hover:border-emerald-500/60 shadow-lg shadow-emerald-950/20'
                    : isOrange
                    ? 'border-amber-500/60 bg-amber-950/10 shadow-lg shadow-amber-950/40 animate-pulse'
                    : 'border-rose-500/60 bg-rose-950/10 shadow-lg shadow-rose-950/40 animate-pulse'
                }`}
              >
                {/* Current Serving Pod Indicator */}
                {pod.isCurrentPod && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-cyan-500 to-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-bl-lg shadow">
                    Active Request Handler
                  </div>
                )}

                {/* Card Header: Pod Name & Tier */}
                <div className="space-y-1 pr-14">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {pod.tier}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">{pod.age}</span>
                  </div>

                  <h3 className="font-mono text-sm font-bold text-white truncate" title={pod.name}>
                    {pod.name}
                  </h3>
                </div>

                {/* Status Badge & Ready Indicator */}
                <div className="mt-4 flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div>
                    {getStatusBadge(pod.statusColor, pod.statusLabel)}
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-zinc-400 block">Ready: <strong className="text-white font-mono">{pod.ready}</strong></span>
                    <span className="text-[11px] text-zinc-500 font-mono">Restarts: {pod.restarts}</span>
                  </div>
                </div>

                {/* Pod Metrics */}
                <div className="mt-3 space-y-2.5 text-xs">
                  {/* CPU Usage Bar */}
                  <div>
                    <div className="flex justify-between text-zinc-400 mb-1">
                      <span className="flex items-center space-x-1">
                        <Cpu className="w-3 h-3 text-cyan-400" />
                        <span>CPU</span>
                      </span>
                      <span className="font-mono text-white font-medium">{pod.cpuUsage} ({pod.cpuPercent}%)</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          pod.cpuPercent > 75 ? 'bg-rose-500' : 'bg-cyan-500'
                        }`}
                        style={{ width: `${Math.min(pod.cpuPercent, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Memory Usage Bar */}
                  <div>
                    <div className="flex justify-between text-zinc-400 mb-1">
                      <span className="flex items-center space-x-1">
                        <HardDrive className="w-3 h-3 text-purple-400" />
                        <span>Memory</span>
                      </span>
                      <span className="font-mono text-white font-medium">{pod.memoryUsage} ({pod.memoryPercent}%)</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${Math.min(pod.memoryPercent, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Network & Node Meta */}
                <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span>IP: <strong className="text-zinc-200">{pod.ip}</strong></span>
                  <span className="truncate max-w-[140px]" title={pod.node}>{pod.node}</span>
                </div>

                {/* Individual Pod Chaos Action Triggers */}
                <div className="mt-3 pt-2 flex items-center justify-end space-x-2">
                  {!isGreen && (
                    <button
                      onClick={() => handleChaosAction(pod.name, 'heal')}
                      className="text-[10px] font-bold px-2 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 rounded border border-emerald-500/40"
                    >
                      Heal Pod
                    </button>
                  )}
                  {isGreen && (
                    <>
                      <button
                        onClick={() => handleChaosAction(pod.name, 'crashloop')}
                        className="text-[10px] font-bold px-2 py-0.5 bg-amber-950/60 hover:bg-amber-900 text-amber-300 rounded border border-amber-500/30"
                        title="Simulate crashloop on this pod"
                      >
                        Crash
                      </button>
                      <button
                        onClick={() => handleChaosAction(pod.name, 'unhealthy')}
                        className="text-[10px] font-bold px-2 py-0.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded border border-rose-500/30"
                        title="Simulate failure on this pod"
                      >
                        Fail
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Kubernetes Deployments Table */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <span>Deployments Overview</span>
        </h2>

        <div className="bg-[#181a20] rounded-xl border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900 text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="p-3 pl-4">Deployment Name</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Ready Replicas</th>
                  <th className="p-3">Strategy</th>
                  <th className="p-3">Container Image</th>
                  <th className="p-3 pr-4">Autoscaling (HPA)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {clusterData?.deployments?.map((dep) => (
                  <tr key={dep.name} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-3 pl-4 font-bold text-white font-mono">{dep.name}</td>
                    <td className="p-3">
                      {getStatusBadge(dep.statusColor, dep.status)}
                    </td>
                    <td className="p-3 font-mono font-bold">
                      <span className={dep.readyReplicas === dep.desiredReplicas ? 'text-emerald-400' : 'text-amber-400'}>
                        {dep.readyReplicas}
                      </span>
                      <span className="text-zinc-500"> / {dep.desiredReplicas} Ready</span>
                    </td>
                    <td className="p-3 text-zinc-300 font-mono text-[11px]">{dep.strategy}</td>
                    <td className="p-3 font-mono text-cyan-300 text-[11px]">{dep.image}</td>
                    <td className="p-3 pr-4 text-purple-300 font-mono text-[11px]">{dep.hpa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Live Kubernetes Event Stream */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          <span>Kubernetes Cluster Events Log</span>
        </h2>

        <div className="bg-[#181a20] rounded-xl border border-zinc-800 p-4 max-h-60 overflow-y-auto no-scrollbar space-y-2 text-xs font-mono">
          {clusterData?.events?.map((evt, idx) => (
            <div key={idx} className="flex items-start space-x-3 p-2 rounded bg-zinc-900/60 border border-zinc-800/60">
              <span className="text-emerald-400 shrink-0 font-bold">[{evt.type}]</span>
              <span className="text-cyan-400 shrink-0 font-semibold">{evt.reason}</span>
              <span className="text-purple-300 shrink-0">{evt.object}</span>
              <span className="text-zinc-300 flex-1 truncate">{evt.message}</span>
              <span className="text-zinc-500 shrink-0 text-[11px]">{evt.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

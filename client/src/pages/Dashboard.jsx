import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Activity,
  Layers,
  Droplets,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { api } from '../lib/api';
import FieldCard from '../components/FieldCard';

export default function Dashboard({ currentUser }) {
  const [fields, setFields] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [fieldsData, tasksData, analyticsData] = await Promise.all([
        api.getFields(),
        api.getWorkflowTasks(),
        api.getAnalyticsSummary()
      ]);
      setFields(fieldsData);
      setTasks(tasksData);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const pendingApprovals = tasks.filter(t => t.status === 'PENDING_APPROVAL');
  const activeDispatches = tasks.filter(t => t.status === 'IN_PROGRESS');

  return (
    <div className="space-y-8 pb-12">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Farm Telemetry & Automation Hub</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Agricultural Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Logged in as <span className="text-slate-200 font-semibold">{currentUser?.fullName}</span> ({currentUser?.role})
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadDashboardData}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Refresh Telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            to="/advisory/new"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-950/40 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>New AI Crop Diagnosis</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Monitored Fields</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-slate-100">{fields.length} Plots</div>
          <div className="text-[11px] text-slate-400 mt-1">
            {fields.reduce((acc, f) => acc + Number(f.area_hectares || 0), 0).toFixed(1)} Total Hectares
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Dispatches</span>
            <Cpu className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-400">{activeDispatches.length} Running</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Valves & Pumps Active
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">HITL Pending</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{pendingApprovals.length} Tasks</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Requires Agronomist Sign-Off
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Water Conserved</span>
            <Droplets className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-teal-300">
            {Number(analytics?.totals?.waterSavedLiters || 46100).toLocaleString()} L
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Precision micro-drip cycles
          </div>
        </div>
      </div>

      {/* Critical HITL Alert Banner if Pending Approvals exist */}
      {pendingApprovals.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-amber-200">
                {pendingApprovals.length} High-Risk Interventions Awaiting Agronomist Verification
              </h4>
              <p className="text-xs text-amber-300/80 mt-0.5">
                Targeted chemical pesticide applications and emergency irrigation triggers require human approval.
              </p>
            </div>
          </div>
          <Link
            to="/workflows"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shrink-0 flex items-center space-x-1.5 transition-all text-center justify-center"
          >
            <span>Review Workflow Tasks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Field Health & Telemetry Catalog */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-100">Active Field Plots & Health Metrics</h2>
            <p className="text-xs text-slate-400">Real-time crop lifecycle status and soil telemetry</p>
          </div>
          <Link
            to="/fields"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
          >
            <span>Manage All Fields</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="h-48 flex items-center justify-center glass-panel rounded-2xl">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-emerald-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {fields.map(field => (
              <FieldCard key={field.id} field={field} />
            ))}
          </div>
        )}
      </div>

      {/* Recent Dispatched Workflow Tasks */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Live Autonomous Task Dispatch Feed
            </h3>
            <p className="text-xs text-slate-400">Machine execution audit log and status progression</p>
          </div>
          <Link
            to="/workflows"
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center space-x-1"
          >
            <span>View Full Kanban</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-2.5">
          {tasks.slice(0, 5).map(task => (
            <div
              key={task.id}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  task.status === 'COMPLETED' ? 'bg-emerald-400' :
                  task.status === 'IN_PROGRESS' ? 'bg-blue-400 animate-pulse' :
                  task.status === 'PENDING_APPROVAL' ? 'bg-amber-400' : 'bg-rose-400'
                }`} />
                <div>
                  <div className="font-bold text-xs text-slate-200">{task.title}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Priority: {task.priority} • Status: {task.status}
                  </div>
                </div>
              </div>

              <div className="text-[11px] font-mono text-emerald-400/80 bg-slate-950 px-2 py-1 rounded border border-slate-800/60 max-w-xs truncate">
                {task.automated_execution_payload?.targetType || 'IRRIGATION'} dispatch
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

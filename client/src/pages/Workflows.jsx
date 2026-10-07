import React, { useState, useEffect } from 'react';
import {
  Workflow,
  Clock,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Filter,
  Layers,
  Cpu
} from 'lucide-react';
import { api } from '../lib/api';
import WorkflowKanban from '../components/WorkflowKanban';
import AgronomistApprovalModal from '../components/AgronomistApprovalModal';

export default function Workflows({ currentUser }) {
  const [tasks, setTasks] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [selectedTaskForApproval, setSelectedTaskForApproval] = useState(null);

  const fetchWorkflowData = async () => {
    setLoading(true);
    try {
      const [tasksData, fieldsData] = await Promise.all([
        api.getWorkflowTasks(),
        api.getFields()
      ]);
      setTasks(tasksData);
      setFields(fieldsData);
    } catch (err) {
      console.error('Error fetching workflows:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflowData();
  }, []);

  const handleQuickApprove = async (taskId) => {
    try {
      await api.approveWorkflowTask(taskId, {
        action: 'APPROVE',
        notes: 'Quick-approved via Workflow board by certified user.',
        agronomistId: currentUser?.id
      });
      fetchWorkflowData();
    } catch (err) {
      alert(`Approval error: ${err.message}`);
    }
  };

  const handleUpdateStatus = async (taskId, status) => {
    try {
      await api.updateWorkflowStatus(taskId, status);
      fetchWorkflowData();
    } catch (err) {
      alert(`Status update error: ${err.message}`);
    }
  };

  const handleConfirmApprovalModal = async (taskId, payload) => {
    await api.approveWorkflowTask(taskId, {
      ...payload,
      agronomistId: currentUser?.id
    });
    fetchWorkflowData();
  };

  const filteredTasks = priorityFilter === 'ALL'
    ? tasks
    : tasks.filter(t => t.priority === priorityFilter);

  const pendingCount = tasks.filter(t => t.status === 'PENDING_APPROVAL').length;
  const inProgressCount = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <Workflow className="w-4 h-4" />
            <span>Autonomous Task Dispatch & HITL Gateway</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Field Workflow & Hardware Automation Kanban
          </h1>
          <p className="text-xs text-slate-400">
            Track automated tickets, Human-in-the-Loop certifications, and pump/valve executions.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchWorkflowData}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Refresh Board"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter and Overview Metrics Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-bold text-slate-300">Priority Filter:</span>
          <div className="flex items-center space-x-1.5 overflow-x-auto">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  priorityFilter === p
                    ? 'bg-emerald-500 text-slate-950 font-extrabold shadow'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs font-semibold text-slate-400 w-full md:w-auto justify-between md:justify-end">
          <span className="text-amber-400">{pendingCount} Pending HITL</span>
          <span className="text-blue-400">{inProgressCount} Dispatched</span>
          <span className="text-emerald-400">{completedCount} Verified</span>
        </div>
      </div>

      {/* Kanban Board Visualizer */}
      {loading ? (
        <div className="h-96 flex items-center justify-center glass-panel rounded-2xl">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent"></div>
        </div>
      ) : (
        <WorkflowKanban
          tasks={filteredTasks}
          fields={fields}
          currentUser={currentUser}
          onOpenApprovalModal={(task) => setSelectedTaskForApproval(task)}
          onQuickApprove={handleQuickApprove}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* Agronomist Approval Modal */}
      {selectedTaskForApproval && (
        <AgronomistApprovalModal
          task={selectedTaskForApproval}
          onClose={() => setSelectedTaskForApproval(null)}
          onConfirm={handleConfirmApprovalModal}
        />
      )}
    </div>
  );
}

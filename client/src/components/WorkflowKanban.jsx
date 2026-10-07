import React from 'react';
import {
  Clock,
  PlayCircle,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';

export default function WorkflowKanban({
  tasks,
  fields,
  currentUser,
  onOpenApprovalModal,
  onQuickApprove,
  onUpdateStatus
}) {
  const getFieldInfo = (fieldId) => {
    return fields.find(f => f.id === fieldId) || { field_name: 'Main Field', current_crop: 'Crop' };
  };

  const columns = [
    {
      id: 'PENDING_APPROVAL',
      title: 'Pending Agronomist Verification',
      subtitle: 'Human-in-the-Loop review required',
      icon: Clock,
      border: 'border-amber-500/30',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      accent: 'from-amber-500/20 to-transparent'
    },
    {
      id: 'IN_PROGRESS',
      title: 'Active Hardware Dispatch',
      subtitle: 'Valves, pumps, & sprayers running',
      icon: PlayCircle,
      border: 'border-blue-500/30',
      badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      accent: 'from-blue-500/20 to-transparent'
    },
    {
      id: 'COMPLETED',
      title: 'Executed & Verified',
      subtitle: 'Telemetry confirmed & audited',
      icon: CheckCircle2,
      border: 'border-emerald-500/30',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      accent: 'from-emerald-500/20 to-transparent'
    },
    {
      id: 'REJECTED',
      title: 'Declined by Agronomist',
      subtitle: 'Manual override or safety stop',
      icon: XCircle,
      border: 'border-rose-500/30',
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      accent: 'from-rose-500/20 to-transparent'
    }
  ];

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'CRITICAL': return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'MEDIUM': return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      default: return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  const isAgronomistOrAdmin = currentUser?.role === 'agronomist' || currentUser?.role === 'admin';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map((col) => {
        const Icon = col.icon;
        const colTasks = tasks.filter(t => t.status === col.id);

        return (
          <div
            key={col.id}
            className="flex flex-col rounded-2xl glass-panel border border-slate-800/90 overflow-hidden min-h-[500px]"
          >
            {/* Column Header */}
            <div className={`p-4 border-b border-slate-800/80 bg-gradient-to-b ${col.accent}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4 text-slate-300" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                    {col.title}
                  </h3>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-black border ${col.badge}`}>
                  {colTasks.length}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{col.subtitle}</p>
            </div>

            {/* Task Cards List */}
            <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[650px]">
              {colTasks.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                  <span>No tasks in this stage</span>
                </div>
              ) : (
                colTasks.map((task) => {
                  const field = getFieldInfo(task.assigned_field_id);
                  const payload = task.automated_execution_payload || {};

                  return (
                    <div
                      key={task.id}
                      className="p-4 rounded-xl glass-card glass-card-hover border border-slate-800 space-y-3 flex flex-col justify-between"
                    >
                      <div>
                        {/* Task Meta */}
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase border ${getPriorityBadge(task.priority)}`}>
                            {task.priority}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium truncate max-w-[120px]">
                            {field.field_name}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-slate-100 leading-snug">
                          {task.title}
                        </h4>

                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {task.description}
                        </p>

                        {/* Machine Readable Execution Payload */}
                        <div className="mt-3 p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] font-mono text-emerald-400 flex items-start space-x-1.5 overflow-hidden">
                          <Cpu className="w-3.5 h-3.5 shrink-0 text-slate-500 mt-0.5" />
                          <span className="truncate">
                            {payload.rawInstructions ||
                             payload.targetType ||
                             JSON.stringify(payload).slice(0, 50)}
                          </span>
                        </div>

                        {task.agronomist_notes && (
                          <div className="mt-2 text-[11px] p-2 rounded bg-purple-950/30 border border-purple-500/20 text-purple-300">
                            <strong>Note:</strong> {task.agronomist_notes}
                          </div>
                        )}
                      </div>

                      {/* Action Triggers based on status and user role */}
                      <div className="pt-2 border-t border-slate-800/80">
                        {task.status === 'PENDING_APPROVAL' && (
                          <div className="space-y-1.5">
                            <button
                              onClick={() => onOpenApprovalModal(task)}
                              className="w-full py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold flex items-center justify-center space-x-1 transition-all"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Review & Verify (HITL)</span>
                            </button>

                            {isAgronomistOrAdmin && (
                              <div className="grid grid-cols-2 gap-1.5">
                                <button
                                  onClick={() => onQuickApprove(task.id)}
                                  className="py-1 px-2 rounded-lg bg-slate-800 hover:bg-emerald-950/60 hover:text-emerald-400 border border-slate-700 text-[11px] font-semibold text-slate-300 flex items-center justify-center space-x-1 transition-all"
                                >
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span>Quick Approve</span>
                                </button>
                                <button
                                  onClick={() => onUpdateStatus(task.id, 'REJECTED')}
                                  className="py-1 px-2 rounded-lg bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 border border-slate-700 text-[11px] font-semibold text-slate-300 flex items-center justify-center space-x-1 transition-all"
                                >
                                  <X className="w-3 h-3 text-rose-400" />
                                  <span>Reject</span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {task.status === 'IN_PROGRESS' && (
                          <button
                            onClick={() => onUpdateStatus(task.id, 'COMPLETED')}
                            className="w-full py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-all"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Confirm Hardware Execution</span>
                          </button>
                        )}

                        {task.status === 'COMPLETED' && (
                          <div className="flex items-center justify-between text-[11px] text-emerald-400 font-semibold px-2 py-1 bg-emerald-950/30 rounded border border-emerald-500/20">
                            <span>Dispatched & Verified</span>
                            <span>100%</span>
                          </div>
                        )}

                        {task.status === 'REJECTED' && (
                          <button
                            onClick={() => onUpdateStatus(task.id, 'PENDING_APPROVAL')}
                            className="w-full py-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-all"
                          >
                            Reopen for Review
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

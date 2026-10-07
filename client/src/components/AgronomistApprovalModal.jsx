import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  X,
  Cpu,
  CheckCircle,
  FileText,
  Sliders,
  Send,
  Ban
} from 'lucide-react';

export default function AgronomistApprovalModal({ task, onClose, onConfirm }) {
  if (!task) return null;

  const payload = task.automated_execution_payload || {};
  const [notes, setNotes] = useState('');
  const [dosageOverride, setDosageOverride] = useState(
    payload.rate || payload.flow_rate || 'Standard AI default'
  );
  const [scheduleTime, setScheduleTime] = useState('Immediate / Next Night Cycle');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAction = async (actionType) => {
    setIsSubmitting(true);
    try {
      await onConfirm(task.id, {
        action: actionType,
        notes: notes.trim() || `Verified by agronomist with action: ${actionType}`,
        overridePayload: {
          adjustedRate: dosageOverride,
          scheduledExecution: scheduleTime,
          verifiedTimestamp: new Date().toISOString()
        }
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="glass-panel w-full max-w-xl rounded-2xl border border-slate-700 shadow-2xl p-6 relative overflow-hidden space-y-5">
        {/* Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-emerald-400 to-amber-500" />

        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400">
                Human-in-the-Loop Certification
              </span>
              <h3 className="text-lg font-bold text-slate-100">
                Agronomist Review & Safety Verification
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Task Details */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">{task.title}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {task.priority} Priority
            </span>
          </div>
          <p className="text-xs text-slate-400">{task.description}</p>
        </div>

        {/* Automated Execution Payload */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center space-x-1.5">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Target Machine & Spray Telemetry Payload</span>
          </label>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 break-all">
            {typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2)}
          </div>
        </div>

        {/* Override Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Adjust Chemical Dosage / Rate
            </label>
            <input
              type="text"
              value={dosageOverride}
              onChange={(e) => setDosageOverride(e.target.value)}
              placeholder="e.g., 1.5L/ha or 20L/min"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Execution Timing Window
            </label>
            <input
              type="text"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              placeholder="e.g., Immediate or Night (22:00)"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Agronomist Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>Agronomic Audit Log / Justification Notes</span>
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Document weather risk checks, buffer zones, or reasons for override..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 resize-none"
          />
        </div>

        {/* Modal Action Buttons */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={() => handleAction('REJECT')}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 hover:text-rose-400 border border-slate-700 text-xs font-bold text-slate-300 flex items-center space-x-1.5 transition-all disabled:opacity-50"
          >
            <Ban className="w-3.5 h-3.5 text-rose-400" />
            <span>Decline / Safety Stop</span>
          </button>

          <button
            type="button"
            onClick={() => handleAction('APPROVE')}
            disabled={isSubmitting}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-slate-950 text-xs font-extrabold flex items-center space-x-1.5 shadow-lg shadow-emerald-950/50 transition-all disabled:opacity-50"
          >
            <CheckCircle className="w-3.5 h-3.5 text-slate-950" />
            <span>Approve & Dispatch Hardware</span>
          </button>
        </div>
      </div>
    </div>
  );
}

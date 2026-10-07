import React from 'react';
import {
  BrainCircuit,
  AlertTriangle,
  CheckCircle,
  ShieldAlert,
  Droplets,
  DollarSign,
  TrendingUp,
  Cpu,
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';

export default function AiReasoningCard({ report, onReviewTask }) {
  if (!report) return null;

  const severity = report.severity_score || report.severityScore || 5;
  const confidence = report.confidence_score || report.confidenceScore || 90;
  const requiresApproval = report.requires_approval ?? report.requiresAgronomistApproval;
  const issues = report.identifiedIssues || report.identified_issues || [];
  const actions = report.recommended_actions || report.recommendedActions || [];
  const impact = report.estimatedImpactMetrics || {
    waterSavedLiters: 1200,
    chemicalSavedCostUsd: 45,
    yieldLossPreventedPercent: 18
  };

  const getSeverityStyle = (score) => {
    if (score >= 7) return {
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      bar: 'bg-rose-500',
      label: 'Critical Stress / Intervention Required'
    };
    if (score >= 4) return {
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      bar: 'bg-amber-500',
      label: 'Moderate Stress Detected'
    };
    return {
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      bar: 'bg-emerald-500',
      label: 'Optimal / Preventive Monitoring'
    };
  };

  const getTargetBadge = (target) => {
    switch (target) {
      case 'IRRIGATION': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'PESTICIDE': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'FERTILIZER': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'SOIL_AMENDMENT': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default: return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    }
  };

  const sevStyle = getSeverityStyle(severity);

  return (
    <div className="glass-panel rounded-2xl border border-slate-700/80 p-6 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Top Banner Accent */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${sevStyle.bar}`} />

      {/* Main Header & Severity */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-900 border border-slate-700 text-slate-300">
              <BrainCircuit className="w-3.5 h-3.5 text-emerald-400" />
              <span>Gemini Structured Output</span>
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${sevStyle.badge}`}>
              Severity {severity}/10 • {sevStyle.label}
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
            {report.diagnosis_title || report.diagnosisTitle}
          </h2>
        </div>

        {/* Confidence Ring & HITL Indicator */}
        <div className="flex items-center space-x-3 bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400">Model Confidence</div>
            <div className="text-lg font-black text-emerald-400">{confidence}%</div>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-emerald-500 flex items-center justify-center text-xs font-bold text-emerald-400">
            ✓
          </div>
        </div>
      </div>

      {/* Human-In-The-Loop Agronomist Verification Alert */}
      {requiresApproval && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <div className="font-bold text-amber-200">
              Human-in-the-Loop (HITL) Verification Triggered
            </div>
            <div className="text-amber-300/80 mt-0.5">
              Because of high severity ({severity}/10) or targeted chemical intervention, these tasks have been routed to the pending approval queue. An agronomist must review before autonomous hardware executes.
            </div>
          </div>
        </div>
      )}

      {/* Explainable AI Agronomic Reasoning */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Explainable Decision Rationale</span>
        </h4>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-sm leading-relaxed text-slate-200">
          {report.ai_reasoning || report.summaryReasoning}
        </div>
      </div>

      {/* Identified Issues Tags */}
      {issues.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Identified Field Stress Factors
          </h4>
          <div className="flex flex-wrap gap-2">
            {issues.map((issue, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-900 border border-slate-700/80 text-slate-300 flex items-center space-x-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>{issue}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Autonomous Actions */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          <span>Autonomous Action Plans & Hardware Dispatches</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {actions.map((action, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${getTargetBadge(action.targetType)}`}>
                    {action.targetType}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    action.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' :
                    action.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {action.priority} Priority
                  </span>
                </div>
                <h5 className="font-bold text-sm text-slate-100">{action.actionTitle}</h5>
                <div className="mt-2 text-xs font-mono text-emerald-400/90 bg-slate-950 p-2 rounded-lg border border-slate-800 break-all">
                  {typeof action.executionPayload === 'string'
                    ? action.executionPayload
                    : JSON.stringify(action.executionPayload)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resource Conservation & Projected Impact Metrics */}
      <div className="pt-4 border-t border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Projected Impact & Efficiency Returns
        </h4>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <Droplets className="w-4 h-4 text-blue-400 mx-auto mb-1" />
            <div className="text-lg font-black text-blue-300">
              {Number(impact.waterSavedLiters || 0).toLocaleString()} L
            </div>
            <div className="text-[10px] text-slate-400">Water Conserved</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <DollarSign className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <div className="text-lg font-black text-emerald-300">
              ${Number(impact.chemicalSavedCostUsd || 0).toFixed(0)}
            </div>
            <div className="text-[10px] text-slate-400">Chemical Cost Saved</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <TrendingUp className="w-4 h-4 text-purple-400 mx-auto mb-1" />
            <div className="text-lg font-black text-purple-300">
              +{Number(impact.yieldLossPreventedPercent || 0)}%
            </div>
            <div className="text-[10px] text-slate-400">Yield Loss Prevented</div>
          </div>
        </div>
      </div>
    </div>
  );
}

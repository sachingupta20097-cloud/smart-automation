import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  BrainCircuit,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Workflow,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { api } from '../lib/api';
import TelemetryForm from '../components/TelemetryForm';
import AiReasoningCard from '../components/AiReasoningCard';

export default function AdvisoryNew() {
  const [searchParams] = useSearchParams();
  const fieldIdParam = searchParams.get('fieldId');

  const [fields, setFields] = useState([]);
  const [loadingFields, setLoadingFields] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function loadFields() {
      try {
        const data = await api.getFields();
        setFields(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingFields(false);
      }
    }
    loadFields();
  }, []);

  const handleFormSubmit = async (formData) => {
    setAnalyzing(true);
    setErrorMsg('');
    setAnalysisResult(null);

    try {
      console.log('Dispatching telemetry to backend API:', formData);
      const res = await api.analyzeAdvisory(formData);
      if (res.success && res.data) {
        setAnalysisResult(res.data);
      } else {
        throw new Error(res.error || 'Failed to analyze crop telemetry');
      }
    } catch (err) {
      console.error('Error during analysis:', err);
      setErrorMsg(err.message || 'Error communicating with AI Decision Engine');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
          <BrainCircuit className="w-4 h-4" />
          <span>Gemini Multimodal Reasoning Pipeline</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          Field Diagnosis & Crop Advisory Engine
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Ingest soil NPK levels, moisture telemetry, micro-climate conditions, and leaf symptom photography for instant autonomous dispatch.
        </p>
      </div>

      {/* Error alert if any */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Two Column Layout: Form on Left/Top, AI Reasoning Result on Right/Bottom */}
      <div className="space-y-8">
        {!analysisResult ? (
          <div>
            {loadingFields ? (
              <div className="h-64 flex items-center justify-center glass-panel rounded-2xl">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-emerald-500 border-t-transparent"></div>
              </div>
            ) : (
              <TelemetryForm
                fields={fields}
                initialFieldId={fieldIdParam}
                onSubmit={handleFormSubmit}
                isLoading={analyzing}
              />
            )}
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Success Bar */}
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-emerald-200">
                    Autonomous Diagnostic & Workflow Dispatch Completed!
                  </h4>
                  <p className="text-xs text-emerald-300/80">
                    {analysisResult.dispatchedTasks?.length || 0} autonomous field tickets generated and queued.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setAnalysisResult(null)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300 flex items-center space-x-1.5 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Run Another Telemetry Test</span>
                </button>
                <Link
                  to="/workflows"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold flex items-center space-x-1.5 shadow-lg shadow-emerald-950/40 transition-all"
                >
                  <Workflow className="w-3.5 h-3.5" />
                  <span>View Dispatched Tasks Kanban</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* AI Decision Reasoning Card */}
            <AiReasoningCard
              report={{
                ...analysisResult.advisoryReport,
                ...analysisResult.aiDiagnosis
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

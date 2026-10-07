import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Droplets,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Layers,
  FileCheck2,
  Calendar
} from 'lucide-react';
import { api } from '../lib/api';
import ImpactChart from '../components/ImpactChart';

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const data = await api.getAnalyticsSummary();
      setSummary(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Ecological & Operational Analytics</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Impact, Yield & Cost Efficiency Analytics
          </h1>
          <p className="text-xs text-slate-400">
            Real-time calculations of ground water conserved, chemical expenditure reductions, and AI accuracy audit logs.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors self-start sm:self-auto"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Main Impact Chart Visualization */}
      {loading ? (
        <div className="h-96 flex items-center justify-center glass-panel rounded-2xl">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent"></div>
        </div>
      ) : (
        <ImpactChart summary={summary} />
      )}

      {/* Field Performance Breakdown Table */}
      {summary && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                Plot-by-Plot Conservation Breakdown
              </h3>
              <p className="text-xs text-slate-400">Detailed resource savings mapped per registered plot</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="p-3">Field Name</th>
                  <th className="p-3">Current Crop</th>
                  <th className="p-3">Acreage (ha)</th>
                  <th className="p-3">Water Saved (Liters)</th>
                  <th className="p-3">Input Costs Saved ($)</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
                {(summary.fieldBreakdown || []).map((row) => (
                  <tr key={row.fieldId} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-3 font-bold text-slate-100">{row.fieldName}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                        {row.currentCrop}
                      </span>
                    </td>
                    <td className="p-3">{row.areaHectares} ha</td>
                    <td className="p-3 text-blue-400 font-bold">
                      {Number(row.waterSaved || 0).toLocaleString()} L
                    </td>
                    <td className="p-3 text-emerald-400 font-bold">
                      ${Number(row.costSaved || 0).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Active Monitoring
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

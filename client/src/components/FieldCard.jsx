import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Layers,
  Sparkles,
  Droplets,
  Thermometer,
  ArrowRight,
  TrendingUp,
  Activity
} from 'lucide-react';

export default function FieldCard({ field, onSelect }) {
  const healthScore = field.health_score || Math.floor(Math.random() * 20) + 75;

  const getHealthBadge = (score) => {
    if (score >= 80) return { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', label: 'Optimal' };
    if (score >= 60) return { color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', label: 'Mild Stress' };
    return { color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', label: 'Critical Attention' };
  };

  const badge = getHealthBadge(healthScore);

  return (
    <div className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800 flex flex-col justify-between relative overflow-hidden group">
      {/* Top accent glow */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-green-600 opacity-60 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 mb-2">
              🌾 {field.current_crop}
            </span>
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
              {field.field_name}
            </h3>
            <div className="flex items-center space-x-1.5 text-xs text-slate-400 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>{field.location_coordinates || '28.6139° N, 77.2090° E'}</span>
            </div>
          </div>

          {/* Health Score Gauge */}
          <div className="flex flex-col items-end">
            <div className={`px-2.5 py-1 rounded-xl border text-xs font-bold flex items-center space-x-1 ${badge.color}`}>
              <Activity className="w-3 h-3" />
              <span>{healthScore}%</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 font-medium">{badge.label}</span>
          </div>
        </div>

        {/* Field Specs */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800/60">
            <div className="flex items-center text-xs text-slate-400">
              <Layers className="w-3.5 h-3.5 mr-1 text-slate-500" />
              Area
            </div>
            <div className="text-sm font-bold text-slate-200 mt-0.5">
              {field.area_hectares} <span className="text-xs font-normal text-slate-400">hectares</span>
            </div>
          </div>

          <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800/60">
            <div className="flex items-center text-xs text-slate-400">
              <Droplets className="w-3.5 h-3.5 mr-1 text-blue-400" />
              Irrigation Mode
            </div>
            <div className="text-sm font-bold text-slate-200 mt-0.5">
              Precision Drip
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <Link
          to={`/advisory/new?fieldId=${field.id}`}
          className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-xs font-bold shadow-md shadow-emerald-950/40 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch AI Advisory</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Link>
      </div>
    </div>
  );
}

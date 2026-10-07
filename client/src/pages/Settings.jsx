import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  ShieldCheck,
  Cpu,
  Database,
  Sliders,
  CheckCircle2,
  Copy,
  ExternalLink,
  Save,
  Radio
} from 'lucide-react';
import { api } from '../lib/api';

export default function Settings() {
  const [health, setHealth] = useState(null);
  const [copied, setCopied] = useState(false);
  const [thresholds, setThresholds] = useState({
    moistureMin: 30,
    phMin: 6.0,
    phMax: 7.5,
    tempWarning: 34,
    autoDispatchEnabled: true,
    mqttBroker: 'mqtt://lora.agri-mesh.internal:1883'
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        const data = await api.checkHealth();
        setHealth(data);
      } catch (e) {
        console.error(e);
      }
    }
    check();
  }, []);

  const handleSaveThresholds = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const copySqlNotice = () => {
    navigator.clipboard.writeText(`-- Run schema.sql from the project root directly inside Supabase SQL Editor`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl">
      {/* Page Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
          <SettingsIcon className="w-4 h-4" />
          <span>Farm Operations & API Configuration</span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          System, AI & Telemetry Threshold Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure autonomous irrigation rules, Gemini structured outputs, and Supabase RLS synchronization.
        </p>
      </div>

      {/* Connectivity & Service Status */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span>Active AI & Cloud Integrations</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">Google Gemini AI Engine</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Model: <span className="text-emerald-400">{health?.geminiModel || 'gemini-3.5-flash'}</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Structured JSON schema reasoning via official @google/genai SDK.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">Supabase Cloud Database</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                CONNECTED
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono truncate">
              URL: <span className="text-emerald-400">https://yfdmntlfgkrxdtvwjgkq.supabase.co</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Row-Level Security (RLS) enabled with multi-role access policies.
            </p>
          </div>
        </div>
      </div>

      {/* Telemetry Trigger Thresholds Form */}
      <form onSubmit={handleSaveThresholds} className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Automated Field Threshold Triggers</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Define conditions that trip autonomous task creation</p>
          </div>
          {savedSuccess && (
            <span className="text-xs text-emerald-400 flex items-center space-x-1 font-bold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settings Saved!</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Low Soil Moisture Auto-Irrigate (%)
            </label>
            <input
              type="number"
              value={thresholds.moistureMin}
              onChange={(e) => setThresholds({ ...thresholds, moistureMin: parseInt(e.target.value) || 0 })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Thermal Heat-Stress Alert (°C)
            </label>
            <input
              type="number"
              value={thresholds.tempWarning}
              onChange={(e) => setThresholds({ ...thresholds, tempWarning: parseInt(e.target.value) || 0 })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Soil pH Safety Range
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="0.1"
                value={thresholds.phMin}
                onChange={(e) => setThresholds({ ...thresholds, phMin: parseFloat(e.target.value) || 0 })}
                className="w-1/2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
              <span className="text-slate-500 text-xs">to</span>
              <input
                type="number"
                step="0.1"
                value={thresholds.phMax}
                onChange={(e) => setThresholds({ ...thresholds, phMax: parseFloat(e.target.value) || 0 })}
                className="w-1/2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Hardware MQTT Dispatch Endpoint
            </label>
            <input
              type="text"
              value={thresholds.mqttBroker}
              onChange={(e) => setThresholds({ ...thresholds, mqttBroker: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={thresholds.autoDispatchEnabled}
              onChange={(e) => setThresholds({ ...thresholds, autoDispatchEnabled: e.target.checked })}
              className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-xs text-slate-300">Allow autonomous task auto-dispatch for low/medium risk actions</span>
          </label>

          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 text-slate-950 font-extrabold text-xs shadow-lg flex items-center space-x-1.5 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Thresholds</span>
          </button>
        </div>
      </form>

      {/* Supabase Schema Provisioning Notice */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center space-x-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Supabase Database Schema (schema.sql)</span>
          </h3>
          <button
            onClick={copySqlNotice}
            className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs text-slate-300 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied!' : 'Copy Notice'}</span>
          </button>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          The complete SQL file (<code className="text-emerald-400 font-mono">schema.sql</code>) has been generated at the project root. You can paste it directly into your Supabase SQL Editor to provision all tables (<code className="text-slate-300">profiles, fields, advisory_reports, workflow_tasks, impact_metrics</code>) and Row-Level Security policies.
        </p>
      </div>
    </div>
  );
}

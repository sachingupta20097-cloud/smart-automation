import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  Sliders,
  Camera,
  X
} from 'lucide-react';

const SAMPLE_LEAF_PRESETS = [
  {
    name: 'Early Blight (Alternaria Solani)',
    crop: 'Tomato',
    stage: 'Flowering',
    moisture: 29,
    ph: 6.8,
    n: 20,
    p: 35,
    k: 110,
    temp: 33,
    humidity: 46,
    symptoms: 'Target-like brown concentric rings on lower leaves, yellow halo on margins, blossom drops.',
    imageDesc: 'Concentric fungal rings observed on lower leaf surface.'
  },
  {
    name: 'Severe Drought & Heat Stress',
    crop: 'Wheat',
    stage: 'Vegetative',
    moisture: 22,
    ph: 6.4,
    n: 18,
    p: 28,
    k: 95,
    temp: 37,
    humidity: 28,
    symptoms: 'Leaves tightly curled inward, necrotic brown tips, severe wilting under mid-day sun.',
    imageDesc: 'Curling wheat leaves with desiccated edges.'
  },
  {
    name: 'Nitrogen Starvation Chlorosis',
    crop: 'Maize',
    stage: 'Vegetative',
    moisture: 52,
    ph: 6.2,
    n: 12,
    p: 45,
    k: 160,
    temp: 29,
    humidity: 62,
    symptoms: 'V-shaped yellowing starting from tip down midrib of older leaves. Stunted internodes.',
    imageDesc: 'Distinct V-pattern yellow chlorosis along leaf midrib.'
  },
  {
    name: 'Optimal Vegetative Conditions',
    crop: 'Cotton',
    stage: 'Vegetative',
    moisture: 65,
    ph: 6.7,
    n: 48,
    p: 52,
    k: 180,
    temp: 28,
    humidity: 55,
    symptoms: 'Deep green canopy, vigorous growth, healthy square initiation.',
    imageDesc: 'Healthy turgid foliage with optimal chlorophyll density.'
  }
];

export default function TelemetryForm({ fields, onSubmit, isLoading, initialFieldId }) {
  const [formData, setFormData] = useState({
    fieldId: initialFieldId || (fields[0]?.id || ''),
    cropType: 'Wheat',
    growthStage: 'Vegetative',
    soilMoisturePercentage: 35,
    soilPh: 6.5,
    nitrogenPpm: 25,
    phosphorusPpm: 38,
    potassiumPpm: 130,
    temperatureCelsius: 32,
    humidityPercentage: 48,
    visualSymptoms: '',
    imageBase64: null,
    imagePreview: null
  });

  useEffect(() => {
    if (initialFieldId) {
      setFormData(prev => ({ ...prev, fieldId: initialFieldId }));
    } else if (fields.length > 0 && !formData.fieldId) {
      setFormData(prev => ({ ...prev, fieldId: fields[0].id }));
    }
  }, [initialFieldId, fields]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imageBase64: reader.result,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      imageBase64: null,
      imagePreview: null
    }));
  };

  const applyPreset = (preset) => {
    setFormData(prev => ({
      ...prev,
      cropType: preset.crop,
      growthStage: preset.stage,
      soilMoisturePercentage: preset.moisture,
      soilPh: preset.ph,
      nitrogenPpm: preset.n,
      phosphorusPpm: preset.p,
      potassiumPpm: preset.k,
      temperatureCelsius: preset.temp,
      humidityPercentage: preset.humidity,
      visualSymptoms: preset.symptoms
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1-Click Quick Scenario Presets */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              One-Click Agronomic Scenarios (Preset Telemetry)
            </h4>
          </div>
          <span className="text-[11px] text-slate-500">Instant test cases</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {SAMPLE_LEAF_PRESETS.map((preset, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => applyPreset(preset)}
              className="text-left p-2.5 rounded-xl bg-slate-900/90 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/40 transition-all group"
            >
              <div className="font-semibold text-xs text-slate-200 group-hover:text-emerald-300 truncate">
                {preset.name}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {preset.crop} • {preset.moisture}% moisture
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
        {/* Field & Crop Metadata */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-4 flex items-center space-x-2">
            <span>1. Target Field & Crop Lifecycle</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Selected Field</label>
              <select
                name="fieldId"
                value={formData.fieldId}
                onChange={handleChange}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
              >
                {fields.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.field_name} ({f.current_crop})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Crop Type</label>
              <select
                name="cropType"
                value={formData.cropType}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
              >
                {['Wheat', 'Rice', 'Maize', 'Tomato', 'Cotton', 'Soybean', 'Sugarcane'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Growth Stage</label>
              <select
                name="growthStage"
                value={formData.growthStage}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
              >
                {['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Harvesting'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Soil Moisture & pH */}
        <div className="pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-4">
            2. Soil Sensor Telemetry
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-300">Soil Moisture (%)</label>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  formData.soilMoisturePercentage < 30 ? 'bg-rose-500/20 text-rose-300' :
                  formData.soilMoisturePercentage > 75 ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {formData.soilMoisturePercentage}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                name="soilMoisturePercentage"
                value={formData.soilMoisturePercentage}
                onChange={handleChange}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>0% (Severe Drought)</span>
                <span>Field Capacity (~60%)</span>
                <span>100% (Saturated)</span>
              </div>
            </div>

            <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-300">Soil pH</label>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  {formData.soilPh}
                </span>
              </div>
              <input
                type="range"
                min="4.0"
                max="9.0"
                step="0.1"
                name="soilPh"
                value={formData.soilPh}
                onChange={handleChange}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>4.0 (Strong Acid)</span>
                <span>6.5 (Neutral Optimal)</span>
                <span>9.0 (Alkaline)</span>
              </div>
            </div>
          </div>
        </div>

        {/* NPK Macronutrients & Micro-climate */}
        <div className="pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-4">
            3. NPK Profiles & Ambient Climate
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nitrogen (N)</label>
              <div className="relative">
                <input
                  type="number"
                  name="nitrogenPpm"
                  value={formData.nitrogenPpm}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
                <span className="absolute right-2.5 top-2.5 text-[10px] text-slate-500">ppm</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phosphorus (P)</label>
              <div className="relative">
                <input
                  type="number"
                  name="phosphorusPpm"
                  value={formData.phosphorusPpm}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
                <span className="absolute right-2.5 top-2.5 text-[10px] text-slate-500">ppm</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Potassium (K)</label>
              <div className="relative">
                <input
                  type="number"
                  name="potassiumPpm"
                  value={formData.potassiumPpm}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
                <span className="absolute right-2.5 top-2.5 text-[10px] text-slate-500">ppm</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Temperature</label>
              <div className="relative">
                <input
                  type="number"
                  name="temperatureCelsius"
                  value={formData.temperatureCelsius}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
                <span className="absolute right-2.5 top-2.5 text-[10px] text-slate-500">°C</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Humidity</label>
              <div className="relative">
                <input
                  type="number"
                  name="humidityPercentage"
                  value={formData.humidityPercentage}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
                <span className="absolute right-2.5 top-2.5 text-[10px] text-slate-500">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Symptoms & Image Upload */}
        <div className="pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-4">
            4. Crop Visual Symptoms & Leaf Image
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Scouted Visual Observations & Symptoms
              </label>
              <textarea
                name="visualSymptoms"
                rows={4}
                value={formData.visualSymptoms}
                onChange={handleChange}
                placeholder="Describe leaf discoloration, wilting patterns, spot shapes, pest sightings..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Field Leaf Photo Upload (AI Multimodal Vision)
              </label>
              {formData.imagePreview ? (
                <div className="relative rounded-xl border border-emerald-500/50 overflow-hidden bg-slate-900 h-28 flex items-center justify-center group">
                  <img
                    src={formData.imagePreview}
                    alt="Leaf upload"
                    className="max-h-full max-w-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600/80 text-white hover:bg-rose-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-xl cursor-pointer bg-slate-900/50 hover:bg-slate-900 transition-all group">
                  <div className="flex flex-col items-center justify-center pt-2 pb-2">
                    <Camera className="w-6 h-6 text-slate-400 group-hover:text-emerald-400 transition-colors mb-1" />
                    <p className="text-xs text-slate-300 font-medium">Click or Drag Leaf Image</p>
                    <p className="text-[10px] text-slate-500">JPG, PNG up to 10MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-950/50 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-950 border-t-transparent"></div>
                <span>Invoking Gemini Decision Engine...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Generate Autonomous AI Advisory</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

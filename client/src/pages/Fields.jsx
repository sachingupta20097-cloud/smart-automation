import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  MapPin,
  Sparkles,
  X,
  CheckCircle,
  Activity,
  Droplets,
  Search
} from 'lucide-react';
import { api } from '../lib/api';
import FieldCard from '../components/FieldCard';

export default function Fields() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newField, setNewField] = useState({
    fieldName: '',
    locationCoordinates: '28.6139° N, 77.2090° E',
    areaHectares: 12.0,
    currentCrop: 'Wheat'
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchFields = async () => {
    setLoading(true);
    try {
      const data = await api.getFields();
      setFields(data);
    } catch (err) {
      console.error('Failed to load fields:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  const handleCreateField = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createField(newField);
      setShowAddModal(false);
      setNewField({
        fieldName: '',
        locationCoordinates: '28.6139° N, 77.2090° E',
        areaHectares: 12.0,
        currentCrop: 'Wheat'
      });
      fetchFields();
    } catch (err) {
      alert(`Error creating field: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredFields = fields.filter(f =>
    f.field_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.current_crop.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Field & Crop Management
          </h1>
          <p className="text-xs text-slate-400">
            Spatial acreage mapping, crop lifecycle stages, and micro-climate zones
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-950/40 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Register New Field Plot</span>
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search plots or crops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 pl-8 focus:outline-none focus:border-emerald-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        <div className="flex items-center space-x-6 text-xs text-slate-400 w-full sm:w-auto justify-between sm:justify-end">
          <div>
            Total Plots: <strong className="text-slate-200">{fields.length}</strong>
          </div>
          <div>
            Total Acreage: <strong className="text-emerald-400">
              {fields.reduce((acc, f) => acc + Number(f.area_hectares || 0), 0).toFixed(1)} ha
            </strong>
          </div>
        </div>
      </div>

      {/* Field Grid */}
      {loading ? (
        <div className="h-64 flex items-center justify-center glass-panel rounded-2xl">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-emerald-500 border-t-transparent"></div>
        </div>
      ) : filteredFields.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center glass-panel rounded-2xl p-6 text-center text-slate-400">
          <Layers className="w-8 h-8 text-slate-600 mb-2" />
          <p className="font-bold text-sm text-slate-300">No matching field plots found</p>
          <p className="text-xs text-slate-500 mt-1">Try another search or register a new plot.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFields.map(field => (
            <FieldCard key={field.id} field={field} />
          ))}
        </div>
      )}

      {/* Register New Field Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl p-6 space-y-5 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <span>Register New Field Plot</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateField} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Plot Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., East Ridge Sector 4 (Soybean)"
                  value={newField.fieldName}
                  onChange={(e) => setNewField({ ...newField, fieldName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Current Crop</label>
                  <select
                    value={newField.currentCrop}
                    onChange={(e) => setNewField({ ...newField, currentCrop: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    {['Wheat', 'Rice', 'Maize', 'Tomato', 'Cotton', 'Soybean', 'Sugarcane'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Area (Hectares)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={newField.areaHectares}
                    onChange={(e) => setNewField({ ...newField, areaHectares: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">GPS Location Coordinates</label>
                <input
                  type="text"
                  placeholder="e.g., 28.6139° N, 77.2090° E"
                  value={newField.locationCoordinates}
                  onChange={(e) => setNewField({ ...newField, locationCoordinates: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 text-slate-950 font-extrabold text-xs shadow-lg transition-all disabled:opacity-50"
                >
                  {submitting ? 'Registering...' : 'Save & Provision Plot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

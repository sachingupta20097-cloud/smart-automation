import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Persistent local storage path as resilient database cache & fallback
const dataDir = path.join(__dirname, '../data');
const storePath = path.join(dataDir, 'store.json');

function ensureDataStore() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(storePath)) {
    const initialSeed = {
      fields: [
        {
          id: '11111111-2222-3333-4444-555555555501',
          user_id: '11111111-1111-1111-1111-111111111111',
          field_name: 'North Valley Alpha (Wheat)',
          location_coordinates: '28.7041° N, 77.1025° E',
          area_hectares: 14.5,
          current_crop: 'Wheat',
          health_score: 82,
          created_at: new Date(Date.now() - 7 * 86400000).toISOString()
        },
        {
          id: '11111111-2222-3333-4444-555555555502',
          user_id: '11111111-1111-1111-1111-111111111111',
          field_name: 'Riverbed West Plot (Tomato)',
          location_coordinates: '28.6289° N, 77.2065° E',
          area_hectares: 8.2,
          current_crop: 'Tomato',
          health_score: 64,
          created_at: new Date(Date.now() - 5 * 86400000).toISOString()
        },
        {
          id: '11111111-2222-3333-4444-555555555503',
          user_id: '11111111-1111-1111-1111-111111111111',
          field_name: 'Sunrise Terrace (Cotton)',
          location_coordinates: '28.5355° N, 77.3910° E',
          area_hectares: 22.0,
          current_crop: 'Cotton',
          health_score: 91,
          created_at: new Date(Date.now() - 3 * 86400000).toISOString()
        }
      ],
      advisory_reports: [
        {
          id: 'aaaa1111-bbbb-2222-cccc-333333333301',
          field_id: '11111111-2222-3333-4444-555555555502',
          submitted_by: '11111111-1111-1111-1111-111111111111',
          crop_type: 'Tomato',
          growth_stage: 'Flowering',
          telemetry_data: {
            soilMoisturePercentage: 31,
            soilPh: 6.8,
            nitrogenPpm: 22,
            phosphorusPpm: 38,
            potassiumPpm: 120,
            temperatureCelsius: 33,
            humidityPercentage: 45
          },
          diagnosis_title: 'Early Blight Warning & Moisture Depletion',
          severity_score: 7,
          confidence_score: 94.2,
          ai_reasoning: 'Field visual scan reveals concentric brown lesion rings on lower tomato foliage typical of Alternaria solani. Concurrently, soil moisture has dropped to 31% with high ambient temperature (33°C), creating severe flower abortion risks.',
          recommended_actions: [
            {
              actionTitle: 'Targeted Fungicide Spray (Chlorothalonil)',
              targetType: 'PESTICIDE',
              executionPayload: 'chemical:Chlorothalonil_720,rate:1.8L_per_ha,droplet_size:medium',
              priority: 'CRITICAL'
            },
            {
              actionTitle: 'Drip Hydration Cycle',
              targetType: 'IRRIGATION',
              executionPayload: 'flow_rate:20L/m,duration:90min',
              priority: 'HIGH'
            }
          ],
          requires_approval: true,
          created_at: new Date(Date.now() - 12 * 3600000).toISOString()
        }
      ],
      workflow_tasks: [
        {
          id: 'task-1111-2222-3333-4444-555555555501',
          advisory_id: 'aaaa1111-bbbb-2222-cccc-333333333301',
          assigned_field_id: '11111111-2222-3333-4444-555555555502',
          title: 'Targeted Fungicide Spray (Chlorothalonil)',
          description: 'High risk chemical treatment requiring agronomist verification before robotic sprayer dispatch.',
          priority: 'CRITICAL',
          status: 'PENDING_APPROVAL',
          automated_execution_payload: {
            chemical: 'Chlorothalonil_720',
            rate: '1.8L_per_ha',
            droplet_size: 'medium'
          },
          created_at: new Date(Date.now() - 12 * 3600000).toISOString(),
          updated_at: new Date(Date.now() - 12 * 3600000).toISOString()
        },
        {
          id: 'task-1111-2222-3333-4444-555555555502',
          advisory_id: 'aaaa1111-bbbb-2222-cccc-333333333301',
          assigned_field_id: '11111111-2222-3333-4444-555555555501',
          title: 'Drip Hydration Cycle - Zone Alpha',
          description: 'Automated irrigation valve activation based on real-time soil telemetry.',
          priority: 'HIGH',
          status: 'IN_PROGRESS',
          automated_execution_payload: {
            valve_id: 'VALVE_04_NORTH',
            flow_rate: '20L/min',
            duration_minutes: 90
          },
          created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 3600000).toISOString()
        },
        {
          id: 'task-1111-2222-3333-4444-555555555503',
          advisory_id: 'aaaa1111-bbbb-2222-cccc-333333333301',
          assigned_field_id: '11111111-2222-3333-4444-555555555503',
          title: 'Micro-Nutrient Boron Foliar Spray',
          description: 'Routine maintenance for cotton flowering stage.',
          priority: 'LOW',
          status: 'COMPLETED',
          automated_execution_payload: {
            compound: 'Solubor_20',
            rate: '1.2kg_per_ha'
          },
          created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
          updated_at: new Date(Date.now() - 8 * 3600000).toISOString()
        }
      ],
      impact_metrics: [
        {
          id: 'metric-01',
          field_id: '11111111-2222-3333-4444-555555555501',
          water_saved_liters: 14200.0,
          chemical_cost_saved_usd: 340.5,
          yield_loss_prevented_percentage: 18.5,
          response_time_minutes: 24,
          recorded_at: new Date(Date.now() - 6 * 86400000).toISOString()
        },
        {
          id: 'metric-02',
          field_id: '11111111-2222-3333-4444-555555555502',
          water_saved_liters: 9800.0,
          chemical_cost_saved_usd: 510.0,
          yield_loss_prevented_percentage: 26.0,
          response_time_minutes: 18,
          recorded_at: new Date(Date.now() - 3 * 86400000).toISOString()
        },
        {
          id: 'metric-03',
          field_id: '11111111-2222-3333-4444-555555555503',
          water_saved_liters: 22100.0,
          chemical_cost_saved_usd: 420.0,
          yield_loss_prevented_percentage: 14.0,
          response_time_minutes: 15,
          recorded_at: new Date(Date.now() - 1 * 86400000).toISOString()
        }
      ],
      profiles: [
        {
          id: '11111111-1111-1111-1111-111111111111',
          email: 'farmer.rajesh@agri.ai',
          full_name: 'Rajesh Patel',
          role: 'farmer',
          created_at: new Date(Date.now() - 30 * 86400000).toISOString()
        },
        {
          id: '22222222-2222-2222-2222-222222222222',
          email: 'dr.elena@agriscience.org',
          full_name: 'Dr. Elena Rostova',
          role: 'agronomist',
          created_at: new Date(Date.now() - 30 * 86400000).toISOString()
        },
        {
          id: '33333333-3333-3333-3333-333333333333',
          email: 'admin.agri@enterprise.io',
          full_name: 'System Administrator',
          role: 'admin',
          created_at: new Date(Date.now() - 30 * 86400000).toISOString()
        }
      ]
    };
    fs.writeFileSync(storePath, JSON.stringify(initialSeed, null, 2), 'utf8');
  }
}

function readStore() {
  ensureDataStore();
  try {
    const raw = fs.readFileSync(storePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading store file, resetting:', err);
    ensureDataStore();
    return JSON.parse(fs.readFileSync(storePath, 'utf8'));
  }
}

function writeStore(data) {
  ensureDataStore();
  fs.writeFileSync(storePath, JSON.stringify(data, null, 2), 'utf8');
}

// ----------------- FIELDS -----------------
export async function getFields() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('fields').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch (e) {
      // fallback to store
    }
  }
  const store = readStore();
  return store.fields;
}

export async function getFieldById(id) {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('fields').select('*').eq('id', id).single();
      if (!error && data) return data;
    } catch (e) {}
  }
  const store = readStore();
  return store.fields.find(f => f.id === id) || null;
}

export async function createField(fieldData) {
  const newField = {
    id: crypto.randomUUID(),
    user_id: fieldData.userId || '11111111-1111-1111-1111-111111111111',
    field_name: fieldData.fieldName,
    location_coordinates: fieldData.locationCoordinates || '28.6139° N, 77.2090° E',
    area_hectares: Number(fieldData.areaHectares),
    current_crop: fieldData.currentCrop,
    created_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('fields').insert([newField]).select().single();
      if (!error && data) {
        // Also update local store
        const store = readStore();
        store.fields.unshift(data);
        writeStore(store);
        return data;
      }
    } catch (e) {}
  }

  const store = readStore();
  store.fields.unshift(newField);
  writeStore(store);
  return newField;
}

// ----------------- ADVISORY REPORTS -----------------
export async function createAdvisoryReport(reportData) {
  const newReport = {
    id: crypto.randomUUID(),
    field_id: reportData.fieldId,
    submitted_by: reportData.submittedBy || '11111111-1111-1111-1111-111111111111',
    crop_type: reportData.cropType,
    growth_stage: reportData.growthStage,
    telemetry_data: reportData.telemetryData,
    image_url: reportData.imageUrl || null,
    diagnosis_title: reportData.diagnosisTitle,
    severity_score: reportData.severityScore,
    confidence_score: reportData.confidenceScore,
    ai_reasoning: reportData.aiReasoning,
    recommended_actions: reportData.recommendedActions,
    requires_approval: reportData.requiresApproval || false,
    created_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('advisory_reports').insert([newReport]).select().single();
      if (!error && data) {
        const store = readStore();
        store.advisory_reports.unshift(data);
        writeStore(store);
        return data;
      }
    } catch (e) {}
  }

  const store = readStore();
  store.advisory_reports.unshift(newReport);
  writeStore(store);
  return newReport;
}

export async function getAdvisoryReportsByField(fieldId) {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('advisory_reports').select('*').eq('field_id', fieldId).order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch (e) {}
  }
  const store = readStore();
  return store.advisory_reports.filter(r => r.field_id === fieldId);
}

export async function getAllAdvisoryReports() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('advisory_reports').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch (e) {}
  }
  const store = readStore();
  return store.advisory_reports;
}

// ----------------- WORKFLOW TASKS -----------------
export async function createWorkflowTask(taskData) {
  const newTask = {
    id: crypto.randomUUID(),
    advisory_id: taskData.advisoryId,
    assigned_field_id: taskData.assignedFieldId,
    title: taskData.title,
    description: taskData.description,
    priority: taskData.priority || 'MEDIUM',
    status: taskData.status || 'PENDING_APPROVAL',
    approved_by: taskData.approvedBy || null,
    automated_execution_payload: taskData.automatedExecutionPayload || {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('workflow_tasks').insert([newTask]).select().single();
      if (!error && data) {
        const store = readStore();
        store.workflow_tasks.unshift(data);
        writeStore(store);
        return data;
      }
    } catch (e) {}
  }

  const store = readStore();
  store.workflow_tasks.unshift(newTask);
  writeStore(store);
  return newTask;
}

export async function getWorkflowTasks(statusFilter = null) {
  if (supabase) {
    try {
      let query = supabase.from('workflow_tasks').select('*').order('created_at', { ascending: false });
      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data;
    } catch (e) {}
  }
  const store = readStore();
  if (statusFilter) {
    return store.workflow_tasks.filter(t => t.status === statusFilter);
  }
  return store.workflow_tasks;
}

export async function updateWorkflowTaskStatus(taskId, updateData) {
  const now = new Date().toISOString();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('workflow_tasks')
        .update({
          status: updateData.status,
          approved_by: updateData.approvedBy,
          updated_at: now,
          ...(updateData.automatedExecutionPayload ? { automated_execution_payload: updateData.automatedExecutionPayload } : {})
        })
        .eq('id', taskId)
        .select()
        .single();
      if (!error && data) {
        // sync local store
        const store = readStore();
        const idx = store.workflow_tasks.findIndex(t => t.id === taskId);
        if (idx !== -1) {
          store.workflow_tasks[idx] = { ...store.workflow_tasks[idx], ...data };
          writeStore(store);
        }
        return data;
      }
    } catch (e) {}
  }

  const store = readStore();
  const task = store.workflow_tasks.find(t => t.id === taskId);
  if (!task) return null;

  task.status = updateData.status;
  task.updated_at = now;
  if (updateData.approvedBy) task.approved_by = updateData.approvedBy;
  if (updateData.notes) task.agronomist_notes = updateData.notes;
  if (updateData.overridePayload) {
    task.automated_execution_payload = {
      ...task.automated_execution_payload,
      ...updateData.overridePayload,
      overridden_by_agronomist: true
    };
  }
  writeStore(store);
  return task;
}

// ----------------- IMPACT METRICS -----------------
export async function createImpactMetric(metricData) {
  const newMetric = {
    id: crypto.randomUUID(),
    field_id: metricData.fieldId,
    water_saved_liters: Number(metricData.waterSavedLiters || 0),
    chemical_cost_saved_usd: Number(metricData.chemicalCostSavedUsd || 0),
    yield_loss_prevented_percentage: Number(metricData.yieldLossPreventedPercent || 0),
    response_time_minutes: Number(metricData.responseTimeMinutes || 12),
    recorded_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('impact_metrics').insert([newMetric]).select().single();
      if (!error && data) {
        const store = readStore();
        store.impact_metrics.unshift(data);
        writeStore(store);
        return data;
      }
    } catch (e) {}
  }

  const store = readStore();
  store.impact_metrics.unshift(newMetric);
  writeStore(store);
  return newMetric;
}

export async function getAnalyticsSummary() {
  let metrics = [];
  let tasks = [];
  let fields = [];

  if (supabase) {
    try {
      const [mRes, tRes, fRes] = await Promise.all([
        supabase.from('impact_metrics').select('*'),
        supabase.from('workflow_tasks').select('*'),
        supabase.from('fields').select('*')
      ]);
      if (!mRes.error && mRes.data) metrics = mRes.data;
      if (!tRes.error && tRes.data) tasks = tRes.data;
      if (!fRes.error && fRes.data) fields = fRes.data;
    } catch (e) {}
  }

  if (metrics.length === 0) {
    const store = readStore();
    metrics = store.impact_metrics;
    tasks = store.workflow_tasks;
    fields = store.fields;
  }

  const totalWaterSaved = metrics.reduce((acc, m) => acc + Number(m.water_saved_liters || 0), 0);
  const totalCostSaved = metrics.reduce((acc, m) => acc + Number(m.chemical_cost_saved_usd || 0), 0);
  const avgYieldLossPrevented = metrics.length > 0
    ? (metrics.reduce((acc, m) => acc + Number(m.yield_loss_prevented_percentage || 0), 0) / metrics.length).toFixed(1)
    : 0;
  const avgResponseTime = metrics.length > 0
    ? Math.round(metrics.reduce((acc, m) => acc + Number(m.response_time_minutes || 0), 0) / metrics.length)
    : 0;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
  const pendingTasks = tasks.filter(t => t.status === 'PENDING_APPROVAL').length;
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;

  return {
    totals: {
      waterSavedLiters: totalWaterSaved,
      chemicalCostSavedUsd: totalCostSaved,
      avgYieldLossPreventedPercent: Number(avgYieldLossPrevented),
      avgResponseTimeMinutes: avgResponseTime,
      totalFields: fields.length,
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks
    },
    metricsLog: metrics.slice(0, 15),
    fieldBreakdown: fields.map(f => {
      const fieldMetrics = metrics.filter(m => m.field_id === f.id);
      const fieldWater = fieldMetrics.reduce((acc, m) => acc + Number(m.water_saved_liters || 0), 0);
      const fieldSaved = fieldMetrics.reduce((acc, m) => acc + Number(m.chemical_cost_saved_usd || 0), 0);
      return {
        fieldId: f.id,
        fieldName: f.field_name,
        currentCrop: f.current_crop,
        areaHectares: f.area_hectares,
        waterSaved: fieldWater,
        costSaved: fieldSaved
      };
    })
  };
}

export async function getProfiles() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('profiles').select('*');
      if (!error && data && data.length > 0) return data;
    } catch (e) {}
  }
  const store = readStore();
  return store.profiles;
}

// Normalize API_BASE: handles relative '/api' or absolute 'https://...onrender.com' with/without '/api' and trailing slashes
const rawBase = (import.meta.env.VITE_API_BASE_URL || '/api').trim();
const cleanBase = rawBase.replace(/\/+$/, '');
export const API_BASE = !cleanBase || cleanBase === '/api'
  ? '/api'
  : cleanBase.endsWith('/api')
    ? cleanBase
    : `${cleanBase}/api`;


async function handleResponse(res) {
  if (!res.ok) {
    let errorMsg = `Server error: ${res.status} ${res.statusText}`;
    try {
      const data = await res.json();
      if (data.message) errorMsg = data.message;
      else if (data.error) errorMsg = data.error;
    } catch (e) { }
    throw new Error(errorMsg);
  }
  return res.json();
}

export const api = {
  // Health
  async checkHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse(res);
  },

  // Fields
  async getFields() {
    const res = await fetch(`${API_BASE}/fields`);
    const json = await handleResponse(res);
    return json.data || [];
  },

  async getField(id) {
    const res = await fetch(`${API_BASE}/fields/${id}`);
    const json = await handleResponse(res);
    return json.data;
  },

  async createField(fieldData) {
    const res = await fetch(`${API_BASE}/fields`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fieldData)
    });
    const json = await handleResponse(res);
    return json.data;
  },

  // Advisory & AI
  async analyzeAdvisory(payload) {
    const res = await fetch(`${API_BASE}/advisory/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  async getAdvisoryReports(fieldId = null) {
    const url = fieldId
      ? `${API_BASE}/advisory/reports/${fieldId}`
      : `${API_BASE}/advisory/reports`;
    const res = await fetch(url);
    const json = await handleResponse(res);
    return json.data || [];
  },

  // Workflows & Tasks
  async getWorkflowTasks(status = null) {
    const url = status ? `${API_BASE}/workflows?status=${status}` : `${API_BASE}/workflows`;
    const res = await fetch(url);
    const json = await handleResponse(res);
    return json.data || [];
  },

  async getPendingWorkflows() {
    const res = await fetch(`${API_BASE}/workflows/pending`);
    const json = await handleResponse(res);
    return json.data || [];
  },

  async approveWorkflowTask(taskId, body) {
    const res = await fetch(`${API_BASE}/workflows/${taskId}/approve`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return handleResponse(res);
  },

  async updateWorkflowStatus(taskId, status) {
    const res = await fetch(`${API_BASE}/workflows/${taskId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return handleResponse(res);
  },

  // Analytics
  async getAnalyticsSummary() {
    const res = await fetch(`${API_BASE}/analytics/summary`);
    const json = await handleResponse(res);
    return json.data;
  }
};

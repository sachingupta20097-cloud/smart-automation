import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { validateRequest } from './middleware/validateRequest.js';
import {
  advisoryInputSchema,
  taskApprovalSchema,
  createFieldSchema
} from './validators/advisoryValidator.js';
import {
  analyzeFieldAdvisory,
  getReportsByField,
  listAllReports
} from './controllers/advisoryController.js';
import {
  listWorkflowTasks,
  getPendingApprovalTasks,
  approveOrRejectTask,
  updateTaskStatus
} from './controllers/workflowController.js';
import { getAnalytics } from './controllers/analyticsController.js';
import {
  listFields,
  getField,
  addField
} from './controllers/fieldController.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and high JSON limit for leaf photo base64 uploads
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'AI-Powered Agriculture Crop Advisory Assistant & Smart Workflow Automation',
    timestamp: new Date().toISOString(),
    geminiModel: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
    supabaseConnected: Boolean(process.env.SUPABASE_URL)
  });
});

// ADVISORY ROUTES
app.post('/api/advisory/analyze', validateRequest(advisoryInputSchema), analyzeFieldAdvisory);
app.get('/api/advisory/reports/:fieldId', getReportsByField);
app.get('/api/advisory/reports', listAllReports);

// WORKFLOW & TASK DISPATCH ROUTES
app.get('/api/workflows', listWorkflowTasks);
app.get('/api/workflows/pending', getPendingApprovalTasks);
app.patch('/api/workflows/:taskId/approve', validateRequest(taskApprovalSchema), approveOrRejectTask);
app.patch('/api/workflows/:taskId/status', updateTaskStatus);

// IMPACT & YIELD ANALYTICS ROUTES
app.get('/api/analytics/summary', getAnalytics);

// FIELD CATALOG MANAGEMENT ROUTES
app.get('/api/fields', listFields);
app.get('/api/fields/:id', getField);
app.post('/api/fields', validateRequest(createFieldSchema), addField);

// Serve Client Static Build if available
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌾 Agri-Advisor & Workflow Automation Server running at http://0.0.0.0:${PORT}`);
  console.log(`🌱 Health check available at http://localhost:${PORT}/api/health`);
  if (fs.existsSync(clientDistPath)) {
    console.log(`🚀 Web Application served at http://localhost:${PORT}`);
  }
});

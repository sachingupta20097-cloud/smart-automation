# AgriAdvisor AI — Smart Crop Advisory & Autonomous Workflow Automation System

[![Node.js](https://img.shields.io/badge/Node.js-v24.21.0-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-3.5_Flash_Structured-orange.svg)](https://ai.google.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_RLS-3ecf8e.svg)](https://supabase.com/)

---

## 🌐 Live Public Access URL
- **Public HTTPS Link**: **[https://65ac146b938d87.lhr.life](https://65ac146b938d87.lhr.life)**
- **Local Dev Server**: `http://localhost:5000` (Backend + UI) and `http://localhost:3000` (Vite)

---

## 🌾 System Architecture & Core Directive

AgriAdvisor AI is a production-grade precision agriculture platform that ingests field sensor telemetry (soil moisture, pH, NPK profiles, micro-climate metrics, and leaf disease photographs), executes structured agronomic decision reasoning via Google Gemini, autonomously constructs and dispatches hardware control tickets (drip irrigation valves, precision fertigation, targeted fungicide sprayers), and provides a Human-in-the-Loop (HITL) certification gateway for agronomists before high-risk chemical or water applications execute.

```
[Soil Sensors / Telemetry / Leaf Photo Ingestion]
                       │
                       ▼
    [Node Express Backend (/api/advisory/analyze)]
                       │
                       ▼
       [Google Gemini Structured JSON Output]
                       │
       ┌───────────────┴───────────────┐
       ▼                               ▼
[Severity >= 7 / Pesticides]       [Routine / Low Risk]
       │                               │
       ▼                               ▼
[HITL Agronomist Approval]      [Autonomous Hardware Dispatch]
       │                               │
       └───────────────┬───────────────┘
                       │
                       ▼
   [Supabase PostgreSQL RLS & Impact Analytics Engine]
                       │
                       ▼
[Real-Time Command Center / Kanban / Analytics Dashboard]
```

---

## 🚀 Key Production Features

1. **Multi-Source Telemetry & Image Ingestion**:
   - Field soil moisture %, pH scale, Nitrogen, Phosphorus, Potassium (NPK ppm).
   - Micro-climate parameters (temperature °C, relative humidity %).
   - Leaf disease image upload with multimodal AI inspection.
   - Built-in 1-click agronomic scenario presets (Early Blight, Drought Stress, Nitrogen Deficiency, Optimal).

2. **AI Advisory & Explainable Decision Engine**:
   - Structured JSON reasoning adhering to typed schemas via official `@google/genai` SDK.
   - Generates diagnosis title, severity score (1-10), confidence score (0-100%), explainable agronomic reasoning, identified stress factors, and machine execution instructions.

3. **Automated Workflow & Task Dispatch**:
   - Autonomous creation of field action tickets (`workflow_tasks`).
   - Priority auto-routing (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`).
   - Machine-readable execution payloads (valve IDs, flow rates, chemical ppm, schedules).

4. **Human-in-the-Loop (HITL) Agronomist Verification**:
   - Safety approval workflow for severity >= 7 or hazardous pesticides.
   - Agronomist certification modal with chemical dosage overrides, execution scheduling, and audit log justification notes.

5. **Real-time Operational Dashboard & Visual Timeline**:
   - Field health gauges, active valve counts, pending approval alerts, and live task dispatch streams.

6. **Efficiency & Yield Analytics Engine**:
   - Recharts visualizations calculating cumulative water saved (liters), chemical cost reductions ($ USD), yield loss prevented (%), and AI response latencies.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Recharts, React Router v6.
- **Backend**: Node.js v24, Express.js (ES Modules), CORS, Zod Schema Validation.
- **AI Engine**: Official Google Gen AI SDK (`@google/genai`) using Gemini Structured Outputs.
- **Database**: Supabase PostgreSQL with Row-Level Security (RLS) & resilient local dual-sync fallback.

---

## 📁 Repository Structure

```
agri-advisor-automation/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx               # Branding, live status & persona role switcher
│   │   │   ├── FieldCard.jsx            # Health score gauge & telemetry summary
│   │   │   ├── TelemetryForm.jsx        # Intake form with presets & camera upload
│   │   │   ├── AiReasoningCard.jsx      # Diagnosis, severity meter, machine payloads
│   │   │   ├── WorkflowKanban.jsx       # 4-stage Kanban with HITL action triggers
│   │   │   ├── ImpactChart.jsx          # Recharts visualizers for water & chemical savings
│   │   │   └── AgronomistApprovalModal.jsx # HITL certification modal & dosage override
│   │   ├── pages/
│   │   │   ├── Login.jsx                # Role-based auth (Farmer, Agronomist, Admin)
│   │   │   ├── Dashboard.jsx            # Command center with KPIs & alerts
│   │   │   ├── Fields.jsx               # Spatial acreage mapping & new plot registry
│   │   │   ├── AdvisoryNew.jsx          # AI diagnosis engine interface
│   │   │   ├── Workflows.jsx            # Kanban task dispatch board
│   │   │   ├── Analytics.jsx            # Resource impact & yield conservation analytics
│   │   │   └── Settings.jsx             # Farm threshold triggers & API settings
│   │   ├── lib/
│   │   │   ├── supabaseClient.js        # Supabase client & demo persona sessions
│   │   │   └── api.js                   # Typed backend HTTP client
│   │   ├── App.jsx                      # Routing & navigation layout
│   │   └── main.jsx                     # Entry mount
│   ├── .env                             # Frontend environment configuration
│   ├── .env.local                       # Local frontend environment variables
│   ├── package.json
│   ├── vite.config.js                   # Vite configuration with API proxy
│   └── tailwind.config.js               # Agricultural green & earth palette
├── server/
│   ├── controllers/
│   │   ├── advisoryController.js        # AI analysis, DB persistence & task dispatch
│   │   ├── workflowController.js        # Task listing, status advance & HITL approvals
│   │   ├── analyticsController.js       # Resource metrics aggregation
│   │   └── fieldController.js           # Plot CRUD operations
│   ├── middleware/
│   │   └── validateRequest.js           # Zod schema validation middleware
│   ├── validators/
│   │   └── advisoryValidator.js         # Zod schemas for telemetry and approvals
│   ├── services/
│   │   ├── geminiService.js             # @google/genai structured output integration
│   │   └── supabaseService.js           # Supabase client with dual-write fallback store
│   ├── .env                             # Backend environment variables
│   ├── index.js                         # Express API server with static SPA delivery
│   └── package.json
├── schema.sql                           # Production Supabase PostgreSQL schema & RLS
└── README.md
```

---

## 🔐 Environment Variables

### Server (`server/.env`):
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
GEMINI_MODEL=gemini-3.5-flash
NODE_ENV=development
```

### Client (`client/.env` and `client/.env.local`):
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_API_BASE_URL=/api
```

---

## 🗄️ Database Provisioning (Supabase SQL)

To provision or sync tables directly in your Supabase project:
1. Open the [Supabase Web Console](https://supabase.com/dashboard/project/yfdmntlfgkrxdtvwjgkq).
2. Go to the **SQL Editor**.
3. Copy and run the contents of [`schema.sql`](file:///d:/smart%20automation%20.pr/schema.sql).
4. All tables (`profiles`, `fields`, `advisory_reports`, `workflow_tasks`, `impact_metrics`) and RLS policies will be created immediately.

---

## ⚡ How to Run Locally

### 1. Start the Server:
```bash
cd server
npm install
npm start
```

### 2. Start the Frontend (Vite):
```bash
cd client
npm install
npm run dev
```

Visit **`http://localhost:5000`** (or `http://localhost:3000`) in your browser.

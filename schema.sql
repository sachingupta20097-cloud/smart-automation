-- ========================================================
-- AI-Powered Agriculture Crop Advisory Assistant & Smart Workflow Automation System
-- Database Schema for Supabase PostgreSQL
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ROLES ENUM
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('farmer', 'agronomist', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE task_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE task_status AS ENUM ('PENDING_APPROVAL', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- USERS / PROFILES TABLE (Tied to Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role DEFAULT 'farmer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FIELDS TABLE
CREATE TABLE IF NOT EXISTS fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    field_name TEXT NOT NULL,
    location_coordinates TEXT,
    area_hectares NUMERIC(8,2) NOT NULL,
    current_crop TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ADVISORY REPORTS TABLE
CREATE TABLE IF NOT EXISTS advisory_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    field_id UUID REFERENCES fields(id) ON DELETE CASCADE NOT NULL,
    submitted_by UUID REFERENCES profiles(id) NOT NULL,
    crop_type TEXT NOT NULL,
    growth_stage TEXT NOT NULL,
    telemetry_data JSONB NOT NULL,
    image_url TEXT,
    diagnosis_title TEXT NOT NULL,
    severity_score INT CHECK (severity_score BETWEEN 1 AND 10),
    confidence_score NUMERIC(5,2) NOT NULL,
    ai_reasoning TEXT NOT NULL,
    recommended_actions JSONB NOT NULL,
    requires_approval BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WORKFLOW TASKS TABLE
CREATE TABLE IF NOT EXISTS workflow_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    advisory_id UUID REFERENCES advisory_reports(id) ON DELETE CASCADE NOT NULL,
    assigned_field_id UUID REFERENCES fields(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority task_priority DEFAULT 'MEDIUM',
    status task_status DEFAULT 'PENDING_APPROVAL',
    approved_by UUID REFERENCES profiles(id),
    automated_execution_payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- IMPACT ANALYTICS TABLE
CREATE TABLE IF NOT EXISTS impact_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    field_id UUID REFERENCES fields(id) ON DELETE CASCADE NOT NULL,
    water_saved_liters NUMERIC(10,2) DEFAULT 0.00,
    chemical_cost_saved_usd NUMERIC(10,2) DEFAULT 0.00,
    yield_loss_prevented_percentage NUMERIC(5,2) DEFAULT 0.00,
    response_time_minutes INT DEFAULT 0,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE advisory_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_metrics ENABLE ROW LEVEL SECURITY;

-- DROP existing policies if any to allow re-runs
DROP POLICY IF EXISTS "Users view own profile" ON profiles;
DROP POLICY IF EXISTS "Farmers manage own fields" ON fields;
DROP POLICY IF EXISTS "Access advisory reports" ON advisory_reports;
DROP POLICY IF EXISTS "Task access policy" ON workflow_tasks;
DROP POLICY IF EXISTS "Analytics access policy" ON impact_metrics;

-- Profiles: Users can view their own profile; Admins view all
CREATE POLICY "Users view own profile" ON profiles 
    FOR SELECT USING (auth.uid() = id);

-- Fields: Farmers view/manage their own fields; Agronomists/Admins view all
CREATE POLICY "Farmers manage own fields" ON fields 
    FOR ALL USING (
        auth.uid() = user_id OR 
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('agronomist', 'admin'))
    );

-- Advisory Reports: Accessible by field owner, agronomist, or admin
CREATE POLICY "Access advisory reports" ON advisory_reports
    FOR ALL USING (
        EXISTS (SELECT 1 FROM fields WHERE fields.id = advisory_reports.field_id AND fields.user_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('agronomist', 'admin'))
    );

-- Tasks: Accessible by relevant actors
CREATE POLICY "Task access policy" ON workflow_tasks
    FOR ALL USING (
        EXISTS (SELECT 1 FROM fields WHERE fields.id = workflow_tasks.assigned_field_id AND fields.user_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('agronomist', 'admin'))
    );

-- Analytics access
CREATE POLICY "Analytics access policy" ON impact_metrics
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM fields WHERE fields.id = impact_metrics.field_id AND fields.user_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('agronomist', 'admin'))
    );

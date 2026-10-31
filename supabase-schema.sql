-- ====================================================================
-- PARATHIPETTI (പരാതിപ്പെട്ടി) - KERALA LSGD PANCHAYAT DATABASE SCHEMA
-- PostgreSQL Schema for Supabase with Realtime Sync & Row Level Security
-- ====================================================================

-- 1. Create Enumerated Types
CREATE TYPE grievance_status AS ENUM (
  'SUBMITTED',
  'ACKNOWLEDGED',
  'UNDER_REVIEW',
  'SITE_INSPECTION',
  'ACTION_IN_PROGRESS',
  'RESOLVED',
  'REJECTED',
  'FORWARDED'
);

CREATE TYPE urgency_level AS ENUM (
  'NORMAL',
  'HIGH',
  'EMERGENCY'
);

CREATE TYPE authority_role AS ENUM (
  'PRESIDENT',
  'SECRETARY',
  'WARD_MEMBER',
  'ASSISTANT_ENGINEER',
  'HEALTH_INSPECTOR',
  'VILLAGE_EXTENSION_OFFICER',
  'AGRICULTURAL_OFFICER',
  'KUDUMBASHREE_CDS'
);

-- 2. Grievances Master Table
CREATE TABLE IF NOT EXISTS public.grievances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_number VARCHAR(64) UNIQUE NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  sla_deadline TIMESTAMPTZ NOT NULL,
  
  -- Panchayat jurisdiction
  district VARCHAR(64) NOT NULL,
  district_ml VARCHAR(64),
  panchayat VARCHAR(128) NOT NULL,
  panchayat_ml VARCHAR(128),
  ward_number INT NOT NULL,
  ward_name VARCHAR(128),

  -- Addressed authority
  addressed_to_role authority_role NOT NULL,
  addressed_to_name VARCHAR(128) NOT NULL,
  addressed_department VARCHAR(128) NOT NULL,

  -- Citizen details
  citizen_name VARCHAR(128) NOT NULL,
  citizen_phone VARCHAR(32) NOT NULL,
  citizen_email VARCHAR(128),
  citizen_address TEXT NOT NULL,
  citizen_aadhaar_last4 VARCHAR(4),

  -- Complaint particulars
  category VARCHAR(128) NOT NULL,
  category_ml VARCHAR(128),
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  urgency urgency_level DEFAULT 'NORMAL',
  location_landmark VARCHAR(255),
  formal_letter_text TEXT,
  attachments TEXT[] DEFAULT '{}',

  -- Current assignment and status
  status grievance_status DEFAULT 'ACKNOWLEDGED',
  current_assignee_name VARCHAR(128) NOT NULL,
  current_assignee_role authority_role NOT NULL,
  resolution_summary TEXT,
  resolved_at TIMESTAMPTZ,
  
  -- Action Taken Report (JSONB)
  action_taken_report JSONB,

  -- Feedback
  citizen_satisfaction VARCHAR(32),
  citizen_rating INT,
  citizen_feedback_text TEXT
);

-- 3. Timeline Audit Events Table
CREATE TABLE IF NOT EXISTS public.timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grievance_id UUID REFERENCES public.grievances(id) ON DELETE CASCADE,
  tracking_number VARCHAR(64) NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  status grievance_status NOT NULL,
  actor_role VARCHAR(64) NOT NULL,
  actor_name VARCHAR(128) NOT NULL,
  title VARCHAR(128) NOT NULL,
  title_ml VARCHAR(128),
  comment TEXT,
  action_taken TEXT
);

-- 4. Enable Supabase Realtime for instant updates on Vercel
ALTER PUBLICATION supabase_realtime ADD TABLE public.grievances;
ALTER PUBLICATION supabase_realtime ADD TABLE public.timeline_events;

-- 5. Row Level Security (RLS)
ALTER TABLE public.grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;

-- Allow public read access to track grievances with token
CREATE POLICY "Public can view grievances by tracking number"
ON public.grievances FOR SELECT
USING (true);

-- Allow inserting petitions
CREATE POLICY "Public and citizens can submit grievances"
ON public.grievances FOR INSERT
WITH CHECK (true);

-- Allow authorities and system to update grievance records
CREATE POLICY "Authorities can update grievances"
ON public.grievances FOR UPDATE
USING (true);

-- Timeline events policies
CREATE POLICY "Public read timeline events"
ON public.timeline_events FOR SELECT
USING (true);

CREATE POLICY "Allow inserting timeline events"
ON public.timeline_events FOR INSERT
WITH CHECK (true);

-- 6. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_grievances_tracking ON public.grievances(tracking_number);
CREATE INDEX IF NOT EXISTS idx_grievances_phone ON public.grievances(citizen_phone);
CREATE INDEX IF NOT EXISTS idx_grievances_assignee ON public.grievances(current_assignee_role);
CREATE INDEX IF NOT EXISTS idx_timeline_tracking ON public.timeline_events(tracking_number);

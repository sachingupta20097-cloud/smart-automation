import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yfdmntlfgkrxdtvwjgkq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : { auth: { signInWithPassword: async () => ({ error: new Error('Auth not configured') }) } };

export const DEMO_USERS = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'farmer.rajesh@agri.ai',
    fullName: 'Rajesh Patel (Lead Farmer)',
    role: 'farmer',
    avatar: '🌾',
    description: 'Field Owner & Autonomous Irrigation Operator'
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'dr.elena@agriscience.org',
    fullName: 'Dr. Elena Rostova (Senior Agronomist)',
    role: 'agronomist',
    avatar: '🔬',
    description: 'Human-in-the-Loop Certifier & Chemical Risk Auditor'
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    email: 'admin.agri@enterprise.io',
    fullName: 'System Administrator',
    role: 'admin',
    avatar: '⚙️',
    description: 'Full Automation, Hardware Mesh & System Overseer'
  }
];

export function getStoredUser() {
  try {
    const raw = localStorage.getItem('agri_current_user');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return DEMO_USERS[0]; // Default to Farmer
}

export function setStoredUser(user) {
  try {
    localStorage.setItem('agri_current_user', JSON.stringify(user));
  } catch (e) {}
}

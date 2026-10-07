import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sprout,
  ShieldCheck,
  User,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  CheckCircle2
} from 'lucide-react';
import { supabase, DEMO_USERS } from '../lib/supabaseClient';

export default function Login({ currentUser, onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('farmer');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleDemoSelect = (user) => {
    onLogin(user);
    navigate('/dashboard');
  };

  const handleCustomAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // Attempt Supabase Auth Sign In
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // If user doesn't exist, try signUp
        const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role: selectedRole }
          }
        });

        if (signUpErr) {
          throw signUpErr;
        }

        const newUser = {
          id: signUpData.user?.id || crypto.randomUUID(),
          email,
          fullName: email.split('@')[0],
          role: selectedRole,
          avatar: selectedRole === 'agronomist' ? '🔬' : selectedRole === 'admin' ? '⚙️' : '🌾',
          description: `Custom Supabase ${selectedRole}`
        };
        onLogin(newUser);
        navigate('/dashboard');
        return;
      }

      if (data?.user) {
        const loggedUser = {
          id: data.user.id,
          email: data.user.email,
          fullName: data.user.email.split('@')[0],
          role: selectedRole,
          avatar: selectedRole === 'agronomist' ? '🔬' : selectedRole === 'admin' ? '⚙️' : '🌾',
          description: `Supabase authenticated ${selectedRole}`
        };
        onLogin(loggedUser);
        navigate('/dashboard');
      }
    } catch (err) {
      console.warn('Supabase auth notice:', err.message);
      // Fallback: create mock profile for testing seamlessly
      const fallbackUser = {
        id: crypto.randomUUID(),
        email,
        fullName: email.split('@')[0] || 'Field User',
        role: selectedRole,
        avatar: selectedRole === 'agronomist' ? '🔬' : selectedRole === 'admin' ? '⚙️' : '🌾',
        description: `Local Session ${selectedRole}`
      };
      onLogin(fallbackUser);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center shadow-2xl shadow-emerald-500/20">
            <Sprout className="w-9 h-9 text-slate-950 stroke-[2.5]" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            AgriAdvisor <span className="bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">AI</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Autonomous crop health intelligence, precision resource dispatching & Human-in-the-Loop decision verification.
          </p>
        </div>

        {/* 1-Click Instant Persona Cards */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              One-Click Instant Role Access (Recommended)
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Select a verified persona to test role-based workflows and HITL approval pipelines immediately.
          </p>

          <div className="space-y-2 pt-1">
            {DEMO_USERS.map((user) => (
              <button
                key={user.id}
                onClick={() => handleDemoSelect(user)}
                className="w-full text-left p-3 rounded-xl bg-slate-900/90 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{user.avatar}</span>
                  <div>
                    <div className="font-bold text-xs text-slate-100 group-hover:text-emerald-300 transition-colors">
                      {user.fullName}
                    </div>
                    <div className="text-[10px] text-slate-400">{user.description}</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* Supabase Custom Authentication Form */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Or Sign In with Supabase Credentials
            </h3>
            <span className="text-[10px] text-emerald-400 font-mono">PostgreSQL RLS</span>
          </div>

          <form onSubmit={handleCustomAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Persona Role</label>
              <div className="grid grid-cols-3 gap-2">
                {['farmer', 'agronomist', 'admin'].map((role) => (
                  <button
                    type="button"
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold capitalize border transition-all ${
                      selectedRole === role
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@agri.ai"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 pl-8"
                />
                <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 pl-8"
                />
                <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-400 bg-rose-950/30 p-2 rounded-lg border border-rose-500/20">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>Authenticating with Supabase...</span>
              ) : (
                <span>Authenticate & Enter Workspace</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Fields from './pages/Fields';
import AdvisoryNew from './pages/AdvisoryNew';
import Workflows from './pages/Workflows';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { getStoredUser, setStoredUser } from './lib/supabaseClient';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());

  const handleSwitchUser = (user) => {
    setCurrentUser(user);
    setStoredUser(user);
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setStoredUser(user);
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
        <Navbar currentUser={currentUser} onSwitchUser={handleSwitchUser} />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login currentUser={currentUser} onLogin={handleLogin} />} />
            <Route path="/dashboard" element={<Dashboard currentUser={currentUser} />} />
            <Route path="/fields" element={<Fields />} />
            <Route path="/advisory/new" element={<AdvisoryNew />} />
            <Route path="/workflows" element={<Workflows currentUser={currentUser} />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>

        <footer className="border-t border-slate-900 bg-slate-950/80 py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>AgriAdvisor AI Precision Agriculture Platform</span>
            </div>
            <div>
              Powered by Google Gemini Structured Outputs & Supabase PostgreSQL RLS
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

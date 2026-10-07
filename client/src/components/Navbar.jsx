import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sprout,
  LayoutDashboard,
  Grid3X3,
  BrainCircuit,
  Workflow,
  BarChart3,
  Settings,
  ShieldCheck,
  ChevronDown,
  Activity,
  UserCheck
} from 'lucide-react';
import { DEMO_USERS } from '../lib/supabaseClient';

export default function Navbar({ currentUser, onSwitchUser }) {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [serverOnline, setServerOnline] = useState(true);

  const navLinks = [
    { path: '/dashboard', label: 'Command Center', icon: LayoutDashboard },
    { path: '/fields', label: 'Field Management', icon: Grid3X3 },
    { path: '/advisory/new', label: 'AI Diagnosis Engine', icon: BrainCircuit, badge: 'Gemini 3.5' },
    { path: '/workflows', label: 'Workflow Dispatch', icon: Workflow },
    { path: '/analytics', label: 'Impact Analytics', icon: BarChart3 },
    { path: '/settings', label: 'System Settings', icon: Settings }
  ];

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'agronomist': return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'admin': return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      default: return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Link to="/dashboard" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Sprout className="w-6 h-6 text-slate-950 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-400 via-green-300 to-teal-200 bg-clip-text text-transparent">
                  AgriAdvisor AI
                </span>
                <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                  Precision Crop Automation
                </span>
              </div>
            </Link>

            {/* System Status Pill */}
            <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-medium text-[11px] text-emerald-400">Gemini Online</span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions & User Switcher */}
          <div className="flex items-center space-x-3">
            {/* User Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors text-left"
              >
                <span className="text-xl">{currentUser?.avatar || '👤'}</span>
                <div className="hidden sm:block text-xs">
                  <div className="font-semibold text-slate-200 truncate max-w-[120px]">
                    {currentUser?.fullName?.split(' ')[0] || 'User'}
                  </div>
                  <span className={`inline-block px-1.5 py-0.2 text-[10px] rounded uppercase font-bold border ${getRoleBadgeColor(currentUser?.role)}`}>
                    {currentUser?.role || 'Farmer'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl glass-panel shadow-2xl border border-slate-700/80 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Switch Persona / Role</p>
                    <p className="text-[11px] text-slate-500">Test HITL approvals & farmer workflows instantly</p>
                  </div>
                  <div className="p-1 space-y-1">
                    {DEMO_USERS.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => {
                          onSwitchUser(user);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left flex items-start space-x-2.5 p-2 rounded-xl text-xs transition-all ${
                          currentUser?.id === user.id
                            ? 'bg-emerald-950/50 border border-emerald-500/30 text-white'
                            : 'hover:bg-slate-800/70 text-slate-300'
                        }`}
                      >
                        <span className="text-xl mt-0.5">{user.avatar}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-100 flex items-center justify-between">
                            <span>{user.fullName}</span>
                            <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded border ${getRoleBadgeColor(user.role)}`}>
                              {user.role}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{user.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="px-3 py-2 border-t border-slate-800/80 text-center">
                    <Link
                      to="/login"
                      onClick={() => setDropdownOpen(false)}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                    >
                      Sign In with Custom Supabase Credentials →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden overflow-x-auto py-2.5 space-x-2 border-t border-slate-800/80 scrollbar-none">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`whitespace-nowrap flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}

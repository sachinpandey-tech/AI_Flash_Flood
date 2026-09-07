import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  Radio,
  Lock,
  Mail,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function Login() {
  const { roles, login, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('demo123');
  const [selectedRole, setSelectedRole] = useState(roles[0].id);
  const [error, setError] = useState('');

  const handleCustomLogin = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email || 'commander.sdma@uk.gov.in', password, selectedRole);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError('Login failed. Please choose a demo role below.');
    }
  };

  const handleQuickRoleLogin = async (roleId) => {
    setError('');
    const r = roles.find(x => x.id === roleId) || roles[0];
    const res = await login(r.defaultEmail, 'demo123', roleId);
    if (res.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      
      {/* Background Decorative Ambient Radars */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <header className="px-6 py-4 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight font-mono">HimaGuard</span>
            <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              SIH26192
            </span>
          </div>
        </div>

        <span className="text-xs text-slate-400">
          Uttarakhand State Disaster Response System
        </span>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6 z-10">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Pitch */}
          <div className="lg:col-span-6 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>SIH 2026 Problem Statement SIH26192</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Hyperlocal Flash Flood <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400">
                Early Warning & Decision Support
              </span>
            </h1>

            <p className="text-sm text-slate-400 leading-relaxed max-w-md mx-auto lg:mx-0">
              A prototype multi-source telemetry & ML-driven flash flood warning platform designed for mountainous Himalayan river basins.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-2 max-w-md mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Honest Engineering Positioning:</span>
              </div>
              <p className="text-[11px] text-slate-400">
                This platform is an operational prototype decision support tool. All readings, ML predictions, and hydrographs are simulated demo data designed to prove the end-to-end early warning workflow.
              </p>
            </div>
          </div>

          {/* Right Login Box */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
              
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white">Operator Console Access</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Select a pre-configured role or click below for instant 1-click demo entry
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* 1-Click Demo Login Roles (Evaluator Shortcut) */}
              <div className="space-y-2 mb-6">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Instant Demo Login (Recommended for SIH Evaluators):
                </p>
                
                {roles.map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleQuickRoleLogin(r.id)}
                    className="w-full p-3 rounded-xl border border-slate-800 bg-slate-950/80 hover:bg-slate-800/80 hover:border-cyan-500/40 text-left transition flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 flex items-center gap-2">
                        <span>{r.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                          {r.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        {r.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-slate-900 px-3 text-slate-400">or sign in with credentials</span>
                </div>
              </div>

              {/* Manual Form */}
              <form onSubmit={handleCustomLogin} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Official Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. commander.sdma@uk.gov.in"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Passcode</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="????????"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-900/30 transition flex items-center justify-center gap-2"
                >
                  {loading ? 'Authenticating...' : 'Enter Operations Center'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-900">
        Smart India Hackathon 2026 ? Problem Statement SIH26192 ? Simulated Prototype Early Warning System
      </footer>

    </div>
  );
}

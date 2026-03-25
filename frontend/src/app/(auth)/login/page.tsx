'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login/', { username, password });
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      const userRes = await api.get('/auth/me/');
      localStorage.setItem('username', userRes.data.username);
      router.push('/dashboard');
    } catch {
      setError('Invalid credentials. Please check your username and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-white">

      {/* ── Left Panel (Login Form) ── */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-16 lg:px-24 relative">
        <div className="relative z-10 w-full max-w-md mx-auto">

          {/* Header & Logos */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-10">
              {/* COER Logo */}
              <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center overflow-hidden border border-slate-200 shadow-sm shrink-0 p-1">
                <Image src="/coer-logo.png" alt="COER" width={60} height={60} className="object-contain rounded-full" />
              </div>

              <div className="h-8 w-px bg-slate-200"></div>

              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-slate-900 tracking-tight">Paperflow.io</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back</h1>
            <p className="text-slate-500 mt-2 sm:mt-2.5 text-sm sm:text-base">Sign in to access the examination portal.</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="flex items-start gap-3 text-red-700 text-sm bg-red-50 border border-red-200 px-4 py-3.5 rounded-xl animate-in fade-in slide-in-from-top-2">
                <svg className="h-5 w-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 sm:py-3 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm sm:text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                placeholder="Enter your university ID"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 sm:py-3 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm sm:text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-indigo-600 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-3.5 bg-indigo-600 text-white font-semibold text-base rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-indigo-600/20 active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2.5 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Authenticating...
                  </>
                ) : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center space-y-4 pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-500">Need help accessing your account? <br /> Contact the Examination Cell.</p>
            <p className="text-xs text-slate-400 font-medium tracking-wide">Powered by Hypenbloom</p>
          </div>
        </div>
      </div>

      {/* ── Right Panel (Hero Graphic) ── */}
      <div className="hidden lg:flex lg:w-[55%] bg-slate-900 relative items-center justify-center overflow-hidden">

        {/* Dynamic Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 opacity-90"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>

        {/* Floating Accent Shapes */}
        <div className="absolute top-[30%] left-[20%] w-24 h-24 border border-white/10 rounded-2xl rotate-12 backdrop-blur-sm"></div>
        <div className="absolute bottom-[25%] right-[20%] w-16 h-16 bg-white/5 rounded-full backdrop-blur-md border border-white/10"></div>

        <div className="relative z-10 text-center px-12 max-w-xl">

          {/* Central Icon/Logo Area */}
          <div className="mx-auto mb-10 relative inline-block">
            <div className="h-28 w-28 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 flex items-center justify-center shadow-2xl relative z-10">
              <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            {/* Background glow for the icon */}
            <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-40 rounded-full scale-110 -z-10"></div>
          </div>

          <h2 className="text-4xl font-bold text-white mb-4 tracking-tight leading-tight">
            Automated Exam <br />
            <span className="text-indigo-300">Generation System</span>
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed mb-10 max-w-md mx-auto font-light">
            Streamline question banks, generate randomized papers, and export print-ready PDFs instantly.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 backdrop-blur-md text-white text-sm font-medium rounded-full">
              <span className="text-indigo-400">⚡</span> Fast Generation
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 backdrop-blur-md text-white text-sm font-medium rounded-full">
              <span className="text-indigo-400">📊</span> Excel Import
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 backdrop-blur-md text-white text-sm font-medium rounded-full">
              <span className="text-indigo-400">📄</span> WeasyPrint PDF
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
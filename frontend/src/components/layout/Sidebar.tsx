'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('username');
    router.push('/login');
  };

  const links = [
    { name: 'Overview', href: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Upload Excel', href: '/dashboard/upload', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' },
    { name: 'Question Bank', href: '/dashboard/bank', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'Generate Paper', href: '/dashboard/generate', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { name: 'Archives', href: '/dashboard/archive', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
  ];

  return (
    <div className="w-64 bg-slate-900 flex flex-col min-h-screen border-r border-slate-800 shadow-xl z-10">

      {/* ── Logo Section ── */}
      <div className="p-4 sm:p-6 pb-4 sm:pb-5 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {/* We keep the logo background white so the COER logo colors don't clash with the dark slate */}
          <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center overflow-hidden border border-slate-700 shadow-sm shrink-0 p-1">
            <Image src="/coer-logo.png" alt="COER" width={36} height={36} className="object-contain rounded-full" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-none">Paperflow.io</h2>
            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1.5">Dashboard</p>
          </div>
        </div>

        {/* Close Button (Mobile Only) */}
        <button onClick={onClose} className="md:hidden p-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* ── Navigation Links ── */}
      <nav className="flex-1 px-3 space-y-1.5 mt-6">
        <p className="px-3 mb-3 text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
          Main Menu
        </p>

        {links.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative ${isActive
                  ? 'bg-indigo-500/15 text-indigo-300'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
            >
              {/* Active Indicator Line */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-500 rounded-r-md shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
              )}

              <svg
                className={`h-5 w-5 flex-shrink-0 transition-colors duration-200 ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={link.icon} />
              </svg>
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* ── Footer / Logout Section ── */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 group"
        >
          <svg className="h-5 w-5 text-slate-500 group-hover:text-red-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout Session
        </button>

        {/* HypenBloom Branding */}
        <div className="mt-4 pt-4 border-t border-slate-800/60 text-center">
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
            Powered by
          </p>
          <Link
            href="https://hypenbloom.com"
            target="_blank"
            className="text-xs font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity flex items-center justify-center gap-1 mt-1"
          >
            HypenBloom
            {/* Tiny aesthetic spark icon */}
            <svg className="w-3 h-3 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0L13.8 8.2L22 10L13.8 11.8L12 20L10.2 11.8L2 10L10.2 8.2L12 0Z" />
            </svg>
          </Link>
        </div>
      </div>

    </div>
  );
}
'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    // Fetch user details from local storage on mount
    setUsername(localStorage.getItem('username') || 'User');

    // Format the role to look nice (e.g., "EXAM_CELL" -> "Exam Cell")
    const rawRole = localStorage.getItem('user_role') || '';
    const formattedRole = rawRole.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    setRole(formattedRole || 'Member');
  }, []);

  const getPageTitle = () => {
    if (pathname.includes('upload')) return 'Upload Question Bank';
    if (pathname.includes('bank')) return 'Manage Questions';
    if (pathname.includes('generate')) return 'Generate Exam Paper';
    if (pathname.includes('archive')) return 'Generated Papers Archive';
    return 'Dashboard Overview';
  };

  return (
    <header className="h-16 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20 shadow-sm">

      {/* ── Left: Page Title ── */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
          {getPageTitle()}
        </h1>
      </div>

      {/* ── Right: Org Badge & User Profile ── */}
      <div className="flex items-center gap-3 sm:gap-5">

        {/* College/Org Badge (Hidden on very small screens) */}
        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-full shadow-inner">
          {/* Logo container stays white so the logo colors render correctly */}
          <div className="h-7 w-7 rounded-full bg-white flex items-center justify-center overflow-hidden border border-slate-600 shrink-0 p-0.5">
            <Image src="/coer-logo.png" alt="COER" width={28} height={28} className="object-contain rounded-full" />
          </div>
          <span className="text-xs font-semibold text-slate-200 tracking-wide">
            COER University
          </span>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-700 hidden sm:block"></div>

        {/* User Profile Button */}
        <button className="flex items-center gap-3 hover:bg-slate-800 p-1 sm:pr-3 rounded-full transition-all duration-200 border border-transparent hover:border-slate-700 group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900">

          {/* Avatar */}
          <div className="h-8 w-8 sm:h-9 sm:w-9 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
            <span className="text-xs sm:text-sm font-bold text-white uppercase">
              {username.charAt(0)}
            </span>
          </div>

          {/* User Details (Hidden on mobile) */}
          <div className="hidden sm:flex flex-col items-start">
            <span className="text-sm font-bold text-white leading-none">
              {username}
            </span>
            <span className="text-[10px] font-semibold text-indigo-400 mt-0.5 tracking-wider uppercase">
              {role}
            </span>
          </div>

          {/* Dropdown Chevron */}
          <svg className="hidden sm:block h-4 w-4 text-slate-500 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

      </div>
    </header>
  );
}
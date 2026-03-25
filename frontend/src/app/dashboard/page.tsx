'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';

interface Stats {
  total_subjects: number;
  total_questions: number;
  total_papers: number;
  part_a_count: number;
  part_b_count: number;
  part_c_count: number;
  co1_count: number;
  co2_count: number;
  co3_count: number;
  papers_this_month: number;
}

const RECENT_ACTIVITY = [
  { action: 'Paper generated', subject: 'Operating Systems', time: '2 hours ago', type: 'generate' },
  { action: 'Questions uploaded', subject: 'Compiler Design', time: 'Yesterday', type: 'upload' },
  { action: 'Paper generated', subject: 'Data Structures', time: '3 days ago', type: 'generate' },
  { action: 'Subject added', subject: 'Computer Networks', time: '5 days ago', type: 'subject' },
];

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setUsername(localStorage.getItem('username') || 'Admin');
    }
    api.get('/dashboard/stats/')
      .then(res => setStats(res.data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return { text: 'Good morning', emoji: '🌤️' };
    if (h < 17) return { text: 'Good afternoon', emoji: '☀️' };
    return { text: 'Good evening', emoji: '🌙' };
  };

  const greeting = getGreeting();
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div
      className={`space-y-7 max-w-7xl mx-auto transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}
    >

      {/* ══════════════════════════════════════════
          HERO BANNER
      ══════════════════════════════════════════ */}
      <div className="relative rounded-2xl overflow-hidden bg-[#0f172a] shadow-xl shadow-slate-900/20">
        {/* grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px),
                              linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        {/* glow blobs */}
        <div className="absolute top-0 right-0 w-[480px] h-[320px] bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/4 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-20 w-[300px] h-[200px] bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 px-7 py-8 sm:px-10 sm:py-10">
          <div>
            {/* date pill */}
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3.5 py-1 mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-400 tracking-wide">{today}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight tracking-tight">
              {greeting.text},{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-sky-300">
                {username}
              </span>{' '}
              <span>{greeting.emoji}</span>
            </h1>
            <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-lg leading-relaxed">
              Paperflow is ready. Upload question banks, generate randomised exam papers,
              and download print-ready PDFs — all in one place.
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <Link
                href="/dashboard/generate"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-indigo-900/40"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Paper
              </Link>
              <Link
                href="/dashboard/upload"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/10 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload Bank
              </Link>
            </div>
          </div>

          {/* COER branding badge */}
          <div className="hidden md:flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-center min-w-[180px] flex-shrink-0">
            <div className="h-14 w-14 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mb-3">
              <svg className="h-7 w-7 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
              </svg>
            </div>
            <p className="text-white font-bold text-sm leading-snug">COER University</p>
            <p className="text-slate-500 text-xs mt-0.5">Examination Cell</p>
            <div className="mt-3 text-xs text-emerald-400 font-medium bg-emerald-400/10 border border-emerald-400/20 rounded-full px-3 py-0.5">
              System Active
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          STATS ROW
      ══════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Questions" value={stats?.total_questions} loading={loading}
          icon={<IconQuestions />} color="indigo"
          sub={loading ? null : `Part A: ${stats?.part_a_count ?? 0} · B: ${stats?.part_b_count ?? 0} · C: ${stats?.part_c_count ?? 0}`}
        />
        <StatCard label="Papers Generated" value={stats?.total_papers} loading={loading}
          icon={<IconPaper />} color="emerald"
          sub={loading ? null : `${stats?.papers_this_month ?? 0} this month`}
        />
        <StatCard label="Active Subjects" value={stats?.total_subjects} loading={loading}
          icon={<IconBook />} color="sky"
          sub="Across all departments"
        />
        <StatCard label="CO Coverage" value={null} loading={loading}
          icon={<IconPieChart />} color="violet"
          sub={loading ? null : `CO1: ${stats?.co1_count ?? 0} · CO2: ${stats?.co2_count ?? 0} · CO3: ${stats?.co3_count ?? 0}`}
          customValue={
            !loading && stats ? (
              <div className="flex items-end gap-1 mt-1">
                <COBar count={stats.co1_count} total={stats.total_questions} color="bg-violet-500" label="CO1" />
                <COBar count={stats.co2_count} total={stats.total_questions} color="bg-sky-500" label="CO2" />
                <COBar count={stats.co3_count} total={stats.total_questions} color="bg-indigo-500" label="CO3" />
              </div>
            ) : null
          }
        />
      </div>

      {/* ══════════════════════════════════════════
          QUICK ACTIONS + ACTIVITY
      ══════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Quick Actions (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          <SectionLabel>Quick Actions</SectionLabel>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <QuickAction href="/dashboard/upload" title="Upload" desc="Excel question bank" icon={<IconUpload />} accent="from-indigo-500/10 to-indigo-500/5" border="hover:border-indigo-300" iconBg="bg-indigo-50 text-indigo-600" />
            <QuickAction href="/dashboard/bank" title="Bank" desc="Browse & filter Qs" icon={<IconBank />} accent="from-sky-500/10 to-sky-500/5" border="hover:border-sky-300" iconBg="bg-sky-50 text-sky-600" />
            <QuickAction href="/dashboard/generate" title="Generate" desc="Create exam paper" icon={<IconGenerate />} accent="from-emerald-500/10 to-emerald-500/5" border="hover:border-emerald-300" iconBg="bg-emerald-50 text-emerald-600" />
            <QuickAction href="/dashboard/archive" title="Archive" desc="Past papers & PDFs" icon={<IconArchive />} accent="from-amber-500/10 to-amber-500/5" border="hover:border-amber-300" iconBg="bg-amber-50 text-amber-600" />
          </div>

          {/* Paper breakdown bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-slate-800">Question Bank Composition</p>
              <span className="text-xs text-slate-400">By Part & CO</span>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-6 bg-slate-100 rounded animate-pulse" />)}
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { label: 'Part A  (1 mark each)', count: stats?.part_a_count ?? 0, total: stats?.total_questions ?? 1, color: 'bg-indigo-500' },
                  { label: 'Part B  (2 marks each)', count: stats?.part_b_count ?? 0, total: stats?.total_questions ?? 1, color: 'bg-sky-500' },
                  { label: 'Part C  (3 marks each)', count: stats?.part_c_count ?? 0, total: stats?.total_questions ?? 1, color: 'bg-emerald-500' },
                ].map(({ label, count, total, color }) => {
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  return (
                    <div key={label}>
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span className="font-medium text-slate-700">{label}</span>
                        <span>{count} questions  ·  {pct}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${color} rounded-full transition-all duration-700`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity (1/3 width) */}
        <div className="space-y-4">
          <SectionLabel>Recent Activity</SectionLabel>
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm divide-y divide-slate-100 overflow-hidden">
            {RECENT_ACTIVITY.map((item, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3.5 hover:bg-slate-50/80 transition-colors">
                <div className={`mt-0.5 h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 ${item.type === 'generate' ? 'bg-emerald-50 text-emerald-600' :
                    item.type === 'upload' ? 'bg-indigo-50 text-indigo-600' :
                      'bg-sky-50 text-sky-600'
                  }`}>
                  {item.type === 'generate' ? <IconGenerate size={14} /> :
                    item.type === 'upload' ? <IconUpload size={14} /> : <IconBook size={14} />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-800 truncate">{item.action}</p>
                  <p className="text-xs text-slate-500 truncate">{item.subject}</p>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap flex-shrink-0 mt-0.5">{item.time}</span>
              </div>
            ))}
            <div className="px-4 py-3 text-center">
              <Link href="/dashboard/archive" className="text-xs text-indigo-600 font-semibold hover:underline">
                View all activity →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-900">How Paperflow Works</p>
            <p className="text-xs text-slate-500 mt-0.5">From question bank to printed paper in three steps</p>
          </div>
          <span className="text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-full px-3 py-1">
            Mid Term · Even Semester · 2025-26
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <HowStep
            step={1} color="indigo"
            title="Prepare & Upload"
            icon={<IconUpload />}
            points={[
              'Download the standard Excel template',
              'Fill in Part A / B / C questions',
              'Tag each question with CO and BTL',
              'Upload — system validates automatically',
            ]}
          />
          <HowStep
            step={2} color="sky"
            title="Configure Paper"
            icon={<IconGenerate />}
            points={[
              'Select subject and exam metadata',
              'Engine picks 2×CO1, 2×CO2, 1×CO3 per part',
              'Preview the 15 selected questions',
              'Regenerate until satisfied',
            ]}
          />
          <HowStep
            step={3} color="emerald"
            title="Download PDF"
            icon={<IconPaper />}
            points={[
              'COER-standard header auto-filled',
              'BTL & CO columns printed on paper',
              'Print-ready A4 PDF — no edits needed',
              'Archived for future reference',
            ]}
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════
          PAPER STRUCTURE REMINDER
      ══════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { part: 'Part A', rule: 'Attempt ALL 5', marks: '1 mark × 5', total: '5 marks', type: 'MCQ', color: 'border-indigo-200 bg-indigo-50/50', badge: 'bg-indigo-100 text-indigo-700' },
          { part: 'Part B', rule: 'Attempt ANY 3 of 5', marks: '2 marks × 3', total: '6 marks', type: 'Short Answer', color: 'border-sky-200 bg-sky-50/50', badge: 'bg-sky-100 text-sky-700' },
          { part: 'Part C', rule: 'Attempt ANY 3 of 5', marks: '3 marks × 3', total: '9 marks', type: 'Descriptive', color: 'border-emerald-200 bg-emerald-50/50', badge: 'bg-emerald-100 text-emerald-700' },
        ].map(p => (
          <div key={p.part} className={`rounded-xl border ${p.color} p-5`}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-slate-900">{p.part}</p>
              <span className={`text-[11px] font-semibold ${p.badge} rounded-full px-2.5 py-0.5`}>{p.type}</span>
            </div>
            <p className="text-xs text-slate-600 mb-2">{p.rule}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">{p.marks}</span>
              <span className="font-bold text-slate-800">{p.total}</span>
            </div>
            <div className="mt-3 border-t border-slate-200/60 pt-3 text-[11px] text-slate-500">
              CO selection: <strong className="text-slate-700">2 × CO1  ·  2 × CO2  ·  1 × CO3</strong>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

/* ════════════════════════════════════════════════
   SUB-COMPONENTS
════════════════════════════════════════════════ */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <h2 className="text-sm font-bold text-slate-800 tracking-tight">{children}</h2>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  );
}

type Color = 'indigo' | 'emerald' | 'sky' | 'violet';
const COLOR_MAP: Record<Color, { bg: string; icon: string; num: string; bar: string }> = {
  indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', num: 'text-indigo-700', bar: 'bg-indigo-500' },
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', num: 'text-emerald-700', bar: 'bg-emerald-500' },
  sky: { bg: 'bg-sky-50', icon: 'text-sky-600', num: 'text-sky-700', bar: 'bg-sky-500' },
  violet: { bg: 'bg-violet-50', icon: 'text-violet-600', num: 'text-violet-700', bar: 'bg-violet-500' },
};

function StatCard({ label, value, loading, icon, color, sub, customValue }: {
  label: string;
  value?: number | null;
  loading: boolean;
  icon: React.ReactNode;
  color: Color;
  sub?: string | null;
  customValue?: React.ReactNode;
}) {
  const c = COLOR_MAP[color];
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between mb-3">
        <div className={`h-10 w-10 rounded-xl ${c.bg} ${c.icon} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
          {icon}
        </div>
        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1">
          {label}
        </span>
      </div>
      {loading ? (
        <div className="space-y-2">
          <div className="h-7 w-20 bg-slate-100 rounded animate-pulse" />
          <div className="h-3 w-32 bg-slate-100 rounded animate-pulse" />
        </div>
      ) : customValue ? (
        <>
          {customValue}
          {sub && <p className="text-[11px] text-slate-400 mt-2">{sub}</p>}
        </>
      ) : (
        <>
          <p className={`text-3xl font-bold tracking-tight ${c.num}`}>{value ?? '—'}</p>
          {sub && <p className="text-[11px] text-slate-400 mt-1">{sub}</p>}
        </>
      )}
    </div>
  );
}

function COBar({ count, total, color, label }: { count: number; total: number; color: string; label: string }) {
  const h = total > 0 ? Math.max(8, Math.round((count / total) * 48)) : 8;
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <span className="text-[10px] text-slate-600 font-bold">{count}</span>
      <div className="w-full bg-slate-100 rounded-sm overflow-hidden" style={{ height: 48 }}>
        <div className={`${color} w-full rounded-sm self-end transition-all duration-700`} style={{ height: h, marginTop: 48 - h }} />
      </div>
      <span className="text-[9px] text-slate-400">{label}</span>
    </div>
  );
}

function QuickAction({ href, title, desc, icon, accent, border, iconBg }: {
  href: string; title: string; desc: string; icon: React.ReactNode;
  accent: string; border: string; iconBg: string;
}) {
  return (
    <Link href={href}
      className={`group relative bg-gradient-to-br ${accent} rounded-xl border border-slate-200 ${border} p-4 transition-all duration-200 flex flex-col items-center text-center hover:shadow-md hover:-translate-y-0.5`}
    >
      <div className={`h-11 w-11 rounded-full ${iconBg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
        {icon}
      </div>
      <p className="text-xs font-bold text-slate-900">{title}</p>
      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{desc}</p>
    </Link>
  );
}

function HowStep({ step, title, icon, points, color }: {
  step: number; title: string; icon: React.ReactNode; points: string[]; color: Color;
}) {
  const c = COLOR_MAP[color];
  return (
    <div className="p-6 hover:bg-slate-50/50 transition-colors">
      <div className="flex items-center gap-3 mb-4">
        <div className={`h-9 w-9 rounded-xl ${c.bg} ${c.icon} flex items-center justify-center flex-shrink-0 text-sm font-bold`}>
          {step}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">{title}</p>
        </div>
      </div>
      <ul className="space-y-2">
        {points.map((pt, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
            <svg className={`h-3.5 w-3.5 ${c.icon} flex-shrink-0 mt-0.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            {pt}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Icons ── */
function IconQuestions({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}
function IconPaper({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
}
function IconBook({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
}
function IconPieChart({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" /></svg>;
}
function IconUpload({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
}
function IconBank({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>;
}
function IconGenerate({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
}
function IconArchive({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>;
}
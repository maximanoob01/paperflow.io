'use client';

import { useEffect, useState, useMemo, useDeferredValue } from 'react';
import { api } from '@/lib/api';

interface Subject {
  id: number;
  name: string;
  code: string;
  department: string;
  semester: number;
}

interface Paper {
  id: number;
  title: string;
  subject: Subject;
  total_questions: number;
  max_marks: number;
  duration: string;
  exam_date: string | null;
  status: 'DRAFT' | 'FINAL';
  created_by_name?: string;
  created_at: string;
}

const STATUS_COLORS = {
  DRAFT: 'bg-amber-50 text-amber-700 border-amber-200',
  FINAL: 'bg-emerald-50 text-emerald-700 border-emerald-200'
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
}

export default function ArchivePage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DRAFT' | 'FINAL'>('ALL');

  useEffect(() => {
    api.get('/papers/')
      .then((r: any) => {
        setPapers(r.data);
      })
      .catch(() => setError('Failed to load archives. Please try refreshing.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = papers;
    if (statusFilter !== 'ALL') {
      result = result.filter((p) => p.status === statusFilter);
    }
    if (deferredSearch.trim()) {
      const q = deferredSearch.toLowerCase();
      result = result.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.subject.name.toLowerCase().includes(q) ||
        p.subject.code.toLowerCase().includes(q)
      );
    }
    return result;
  }, [papers, statusFilter, deferredSearch]);

  const handleDownload = async (paperId: number, subjectName: string) => {
    try {
      const res = await api.get(`/papers/${paperId}/pdf/`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      const safeName = subjectName ? subjectName.replace(/\s+/g, '_') : 'Subject';
      link.setAttribute('download', `QP_${safeName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Failed to download PDF. Please try again.');
    }
  };

  // --- Loading Skeleton ---
  if (loading) return (
    <div className="space-y-4 max-w-6xl mx-auto">
      <div className="h-10 w-48 bg-slate-200 rounded-lg animate-pulse mb-8" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 flex gap-5 items-center animate-pulse shadow-sm">
          <div className="h-12 w-12 rounded-xl bg-slate-100 flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-64 bg-slate-200 rounded" />
            <div className="h-3 w-40 bg-slate-100 rounded" />
          </div>
          <div className="h-8 w-24 bg-slate-100 rounded-lg" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Paper Archives</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            History of <span className="font-semibold text-slate-700">{papers.length}</span> generated document{papers.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 animate-in fade-in slide-in-from-top-2">
          <svg className="h-5 w-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {error}
        </div>
      )}

      {/* ── Toolbar (Search & Tabs) ── */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">

        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, subject, or code..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-shadow"
          />
        </div>

        {/* Segmented Controls */}
        <div className="flex p-1 bg-slate-100 rounded-lg border border-slate-200 shrink-0 self-start sm:self-auto">
          {(['ALL', 'DRAFT', 'FINAL'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold tracking-wide transition-all duration-200 ${statusFilter === s
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Data List ── */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 sm:p-16 text-center shadow-sm flex flex-col items-center">
          <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
            <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <p className="text-base font-semibold text-slate-800">No archives found</p>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {filtered.map((paper, index) => (
            <div
              key={paper.id}
              className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-slate-50/80 transition-colors ${index !== filtered.length - 1 ? 'border-b border-slate-100' : ''
                }`}
            >

              {/* Icon */}
              <div className="hidden sm:flex flex-shrink-0 h-12 w-12 rounded-xl bg-indigo-50 border border-indigo-100 items-center justify-center">
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>

              {/* Paper Info */}
              <div className="flex-1 min-w-0 pr-4">
                <h3 className="text-sm font-bold text-slate-900 truncate tracking-tight">{paper.title}</h3>

                {/* Metadata Row */}
                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">{paper.subject.code}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:inline-block"></span>
                  <span>{paper.total_questions} Questions</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:inline-block"></span>
                  <span>{paper.max_marks} Marks</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:inline-block"></span>
                  <span>{paper.duration}</span>
                </div>
              </div>

              {/* Actions & Status */}
              <div className="flex items-center gap-4 flex-shrink-0 mt-3 sm:mt-0 justify-between sm:justify-end border-t border-slate-100 sm:border-0 pt-3 sm:pt-0">
                <div className="flex items-center gap-4">
                  <span className="hidden lg:block text-xs font-medium text-slate-400">
                    {formatDate(paper.created_at)}
                  </span>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider border uppercase ${STATUS_COLORS[paper.status]}`}>
                    {paper.status}
                  </span>
                </div>

                <button
                  onClick={() => handleDownload(paper.id, paper.subject.name)}
                  className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm group"
                >
                  <svg className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <span className="hidden sm:inline">Download PDF</span>
                  <span className="sm:hidden">PDF</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
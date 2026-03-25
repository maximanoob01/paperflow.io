'use client';

import { useEffect, useState, useCallback, useMemo, useDeferredValue } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';

interface Subject {
  id: number;
  name: string;
  code: string;
}

interface Question {
  id: number;
  text: string;
  part: string;
  co: string;
  btl: number;
  subject: Subject;
  uploaded_by_name?: string;
  created_at: string;
}

// Upgraded to professional SaaS colors
const PART_COLORS: Record<string, string> = {
  A: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  B: 'bg-blue-50 text-blue-700 border-blue-200',
  C: 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

export default function QuestionBankPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [subjectFilter, setSubjectFilter] = useState('');
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);

  // Interaction States
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (subjectFilter) params.subject = subjectFilter;
      const res = await api.get('/questions/', { params });
      setQuestions(res.data);
    } catch {
      setError('Failed to load questions. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  }, [subjectFilter]);

  useEffect(() => {
    api.get('/subjects/').then((r: any) => setSubjects(r.data)).catch(() => { });
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const filtered = useMemo(() => {
    if (!deferredSearch.trim()) return questions;
    const s = deferredSearch.toLowerCase();
    return questions.filter((q) =>
      q.text.toLowerCase().includes(s) || q.subject?.name?.toLowerCase().includes(s)
    );
  }, [questions, deferredSearch]);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await api.delete(`/questions/${id}/`);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      setConfirmDeleteId(null);
    } catch {
      setError('Failed to delete question.');
    } finally {
      setDeletingId(null);
    }
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="space-y-4 max-w-6xl mx-auto">
        <div className="h-10 w-48 bg-slate-200 rounded-lg animate-pulse mb-8" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 flex gap-4 items-center animate-pulse shadow-sm">
            <div className="h-4 w-6 bg-slate-200 rounded shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-4 w-3/4 bg-slate-200 rounded" />
              <div className="h-3 w-1/4 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Question Bank</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Managing <span className="font-semibold text-slate-700">{filtered.length}</span> question{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/dashboard/upload"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Upload New
        </Link>
      </div>

      {/* ── Error Alert ── */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 animate-in fade-in slide-in-from-top-2">
          <svg className="h-5 w-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {error}
        </div>
      )}

      {/* ── Toolbar (Search & Filter) ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Subject Dropdown */}
        <div className="relative w-full sm:w-64 shrink-0">
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="w-full pl-3 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none shadow-sm transition-shadow"
          >
            <option value="">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.code} — {s.name}</option>
            ))}
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </div>

        {/* Search Input */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions by text or subject..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-shadow"
          />
        </div>
      </div>

      {/* ── Data List ── */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm flex flex-col items-center">
          <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
            <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <p className="text-base font-semibold text-slate-800">No questions found</p>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {filtered.map((q, index) => (
            <div key={q.id} className={`border-b border-slate-100 last:border-0 transition-colors ${expandedId === q.id ? 'bg-indigo-50/30' : 'hover:bg-slate-50/80'}`}>

              {/* Row Header */}
              <div
                className="px-4 py-3 sm:px-5 sm:py-4 flex items-center gap-3 sm:gap-4 cursor-pointer"
                onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
              >
                <span className="text-xs text-slate-400 font-mono w-6 text-center">{index + 1}</span>

                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-sm font-medium text-slate-900 line-clamp-1 leading-relaxed">
                    {q.text}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {q.subject?.code} — {q.subject?.name}
                  </p>
                </div>

                {/* Badges */}
                <div className="hidden md:flex items-center gap-2 shrink-0">
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                    CO: {q.co}
                  </span>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${PART_COLORS[q.part] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                    Part {q.part}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center shrink-0 pl-2" onClick={(e) => e.stopPropagation()}>
                  {confirmDeleteId === q.id ? (
                    <div className="flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-200">
                      <button
                        onClick={() => handleDelete(q.id)}
                        disabled={deletingId === q.id}
                        className="px-2.5 py-1 text-xs font-semibold bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        {deletingId === q.id ? '...' : 'Confirm'}
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2.5 py-1 text-xs font-semibold bg-white text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(q.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete Question"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded Details Pane */}
              {expandedId === q.id && (
                <div className="px-5 pb-5 pt-2 pl-14 animate-in slide-in-from-top-2 duration-200">
                  <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                    <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                      {q.text}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-slate-400 uppercase tracking-wider font-semibold">Bloom's Level:</span>
                        <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{q.btl}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-slate-400 uppercase tracking-wider font-semibold">Course Outcome:</span>
                        <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{q.co}</span>
                      </div>
                      <div className="md:hidden flex items-center gap-1.5 text-xs">
                        <span className="text-slate-400 uppercase tracking-wider font-semibold">Part:</span>
                        <span className={`font-medium px-2 py-0.5 rounded border ${PART_COLORS[q.part]}`}>{q.part}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
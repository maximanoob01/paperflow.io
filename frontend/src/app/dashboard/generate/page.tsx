'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import SearchableSelect from '@/components/ui/SearchableSelect';

interface Subject {
  id: number;
  name: string;
  code: string;
  department: string;
  semester: number;
}

interface GeneratedPaper {
  id: number;
  title: string;
  subject: Subject;
  total_questions: number;
  max_marks: number;
  duration: string;
  exam_date: string | null;
  status: string;
}

export default function GeneratePaperPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingSubjects, setFetchingSubjects] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<GeneratedPaper | null>(null);

  const [form, setForm] = useState({
    subject_id: '',
    title: '',
    course: '',
    exam_type: 'Mid Term Exam',
    semester: '1',
    total_questions: '20',
    max_marks: '100',
    duration: '3 Hours',
    exam_date: '',
    instructions: '1. Attempt all questions.\n2. All questions carry equal marks.\n3. Use of mobile phones is strictly prohibited.',
  });

  useEffect(() => {
    api.get('/subjects/')
      .then((r: any) => setSubjects(r.data))
      .catch(() => setError('Failed to load subjects. Please refresh the page.'))
      .finally(() => setFetchingSubjects(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (value: string) => {
    const subject = subjects.find((s) => s.id === parseInt(value));
    setForm((prev) => ({
      ...prev,
      subject_id: value,
      title: subject ? `${subject.name} Question Paper` : prev.title,
      course: subject ? `B.Tech ${subject.department}` : prev.course,
      semester: subject ? String(subject.semester) : prev.semester,
    }));
  };

  const handleGenerate = async () => {
    setError('');
    setSuccess(null);
    if (!form.subject_id) {
      setError('Please select a subject to continue.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        subject_id: parseInt(form.subject_id),
        title: form.title,
        course: form.course,
        exam_type: form.exam_type,
        semester: form.semester,
        total_questions: parseInt(form.total_questions),
        max_marks: parseInt(form.max_marks),
        duration: form.duration,
        exam_date: form.exam_date || null,
        instructions: form.instructions
      };
      const res = await api.post('/papers/generate/', payload);
      setSuccess(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate paper. Ensure the question bank has enough questions.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!success) return;
    try {
      const res = await api.get(`/papers/${success.id}/pdf/`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      const safeName = success.subject?.name ? success.subject.name.replace(/\s+/g, '_') : 'Subject';
      link.setAttribute('download', `QP_${safeName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setError('Failed to download PDF.');
    }
  };

  const resetForm = () => {
    setSuccess(null);
    setForm({
      subject_id: '', title: '', course: '', exam_type: 'Mid Term Exam', semester: '1', total_questions: '20', max_marks: '100', duration: '3 Hours', exam_date: '',
      instructions: '1. Attempt all questions.\n2. All questions carry equal marks.\n3. Use of mobile phones is strictly prohibited.'
    });
  };

  // Shared input styling
  const inputClass = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5 ml-0.5";

  // ── Success State View ──
  if (success) {
    return (
      <div className="max-w-xl mx-auto mt-6 sm:mt-8 animate-in zoom-in-95 duration-300">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg shadow-slate-200/40 text-center relative overflow-hidden">

          {/* Decorative Background Blob */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-emerald-50 to-white -z-10" />

          <div className="mx-auto h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6 shadow-sm border border-emerald-200">
            <svg className="h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Paper Generated Successfully!</h2>
          <p className="text-slate-500 mt-2">The system successfully drafted the paper with <span className="font-semibold text-slate-700">{success.total_questions} random questions</span>.</p>

          <div className="mt-8 bg-slate-50 rounded-2xl border border-slate-100 p-5 text-left">
            <dl className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <dt className="text-slate-500 font-medium text-xs uppercase tracking-wider">Subject</dt>
                <dd className="font-bold text-slate-900 mt-1 truncate" title={success.subject?.name}>{success.subject?.name}</dd>
              </div>
              <div>
                <dt className="text-slate-500 font-medium text-xs uppercase tracking-wider">Course</dt>
                <dd className="font-bold text-slate-900 mt-1 truncate" title={success.title}>{success.title}</dd>
              </div>
              <div>
                <dt className="text-slate-500 font-medium text-xs uppercase tracking-wider">Max Marks</dt>
                <dd className="font-bold text-slate-900 mt-1">{success.max_marks}</dd>
              </div>
              <div>
                <dt className="text-slate-500 font-medium text-xs uppercase tracking-wider">Duration</dt>
                <dd className="font-bold text-slate-900 mt-1">{success.duration}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={handleDownloadPDF}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold text-sm shadow-md shadow-indigo-500/20 transition-all active:scale-[0.98]"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Download PDF Document
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/dashboard/archive')}
                className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:text-indigo-600 font-semibold text-sm transition-colors"
              >
                Go to Archives
              </button>
              <button
                onClick={resetForm}
                className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:text-indigo-600 font-semibold text-sm transition-colors"
              >
                Create Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Generation Form View ──
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">

      {/* Header */}
      <div className="border-b border-slate-200 pb-4 sm:pb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Generate Exam Paper</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Set parameters below. Paperflow will randomly assemble questions from the bank.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          <svg className="h-5 w-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {error}
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">

          {/* Section 1: Subject Selection */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Target Subject</h3>
            {fetchingSubjects ? (
              <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
            ) : (
              <SearchableSelect
                label="Select Subject Database"
                required
                placeholder="Search or select a subject..."
                value={form.subject_id}
                onChange={handleSubjectChange}
                options={subjects.map((s) => ({
                  value: String(s.id),
                  label: `${s.code} — ${s.name}`,
                  sub: `Sem ${s.semester}`,
                }))}
              />
            )}
          </div>

          {/* Section 2: Header Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Paper Header Info</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Paper Title</label>
                <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Mid-Term Examination" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Course / Program</label>
                <input type="text" name="course" value={form.course} onChange={handleChange} placeholder="e.g. B.Tech CSE" className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
              <div>
                <label className={labelClass}>Exam Type</label>
                <select name="exam_type" value={form.exam_type} onChange={handleChange} className={inputClass}>
                  <option value="Mid Term Exam">Mid Term Exam</option>
                  <option value="End Sem Exam">End Sem Exam</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Semester</label>
                <select name="semester" value={form.semester} onChange={handleChange} className={inputClass}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <option key={sem} value={String(sem)}>Semester {sem}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Configuration */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Generation Parameters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className={labelClass}>Total Questions <span className="text-red-500">*</span></label>
                <input type="number" name="total_questions" value={form.total_questions} onChange={handleChange} min="1" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Maximum Marks</label>
                <input type="number" name="max_marks" value={form.max_marks} onChange={handleChange} min="1" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Time Duration</label>
                <input type="text" name="duration" value={form.duration} onChange={handleChange} placeholder="e.g. 3 Hours" className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Examination Date <span className="text-slate-400 font-normal">(Optional)</span></label>
              <input type="date" name="exam_date" value={form.exam_date} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          {/* Section 4: Instructions */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Student Instructions</h3>
            <div>
              <label className={labelClass}>General Instructions</label>
              <textarea
                name="instructions"
                value={form.instructions}
                onChange={handleChange}
                rows={4}
                className={`${inputClass} resize-y min-h-[100px] leading-relaxed`}
              />
            </div>
          </div>

        </div>

        {/* Footer Action */}
        <div className="bg-slate-50 p-6 sm:px-8 border-t border-slate-200">
          <button
            onClick={handleGenerate}
            disabled={loading || fetchingSubjects}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold text-sm disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20 transition-all active:scale-[0.99]"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Assembling Question Paper...
              </>
            ) : (
              <>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Generate Question Paper
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
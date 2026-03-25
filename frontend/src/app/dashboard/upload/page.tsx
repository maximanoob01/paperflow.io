'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '@/lib/api';
import SearchableSelect from '@/components/ui/SearchableSelect';

interface Subject {
  id: number;
  name: string;
  code: string;
  department: string;
}

export default function UploadQuestionsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ questions_added: number; errors: string[]; message: string } | null>(null);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.get('/subjects/')
      .then((res: any) => setSubjects(res.data))
      .catch(() => setError('Failed to load subjects from the server.'));
  }, []);

  // --- Drag & Drop Handlers ---
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setError('');
    setResult(null);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls'))) {
      setFile(droppedFile);
    } else {
      setError('Invalid file type. Please upload an Excel file (.xlsx or .xls).');
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setResult(null);
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  // --- API Actions ---
  const handleUpload = async () => {
    if (!file) return setError('Please select a file first.');
    if (!selectedSubject) return setError('Please select a subject.');

    setUploading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('subject_id', selectedSubject);

    try {
      const res = await api.post('/questions/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setError(err.response?.data?.error || 'Upload failed. Please check the template format and try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const res = await api.get('/questions/template/', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ExamForge_Template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setError('Failed to download the template file.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Question Bank Upload</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Populate your database using the standard Excel format.</p>
        </div>
        <button
          onClick={handleDownloadTemplate}
          className="flex items-center gap-2 text-sm px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-colors font-medium border border-indigo-200 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Get Template
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6">

        {/* Subject Selection */}
        <SearchableSelect
          label="Target Subject"
          required
          placeholder="Search or select a subject..."
          value={selectedSubject}
          onChange={(val) => setSelectedSubject(val)}
          options={subjects.map((s) => ({
            value: String(s.id),
            label: `${s.code} — ${s.name}`,
            sub: s.department,
          }))}
        />

        {/* Dropzone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative group p-8 sm:p-12 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all duration-200 ease-in-out
            ${isDragging ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' :
              file ? 'border-emerald-500 bg-emerald-50' :
                'border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/50'}`}
        >
          <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFileSelect} className="hidden" />

          {file ? (
            <div className="flex flex-col items-center animate-in fade-in duration-200">
              <svg className="w-12 h-12 text-emerald-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              <p className="font-semibold text-emerald-700">{file.name}</p>
              <p className="text-sm text-emerald-600/80 mt-1">{(file.size / 1024).toFixed(1)} KB — Click to change file</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <svg className={`w-12 h-12 mb-3 transition-colors ${isDragging ? 'text-indigo-500' : 'text-gray-400 group-hover:text-indigo-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              <p className="font-medium text-gray-700 text-lg">
                {isDragging ? 'Drop it right here!' : 'Click or drag Excel file to upload'}
              </p>
              <p className="text-sm text-gray-500 mt-2">Strictly accepts .xlsx or .xls formats</p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleUpload}
          disabled={!file || !selectedSubject || uploading}
          className="w-full flex items-center justify-center py-3 px-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          {uploading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Processing Data...
            </>
          ) : (
            'Upload to Question Bank'
          )}
        </button>
      </div>

      {/* --- Notification Area --- */}

      {/* Error Alert */}
      {error && (
        <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-in slide-in-from-bottom-2">
          <svg className="w-5 h-5 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <p className="font-medium pt-0.5">{error}</p>
        </div>
      )}

      {/* Success/Warning Alert */}
      {result && (
        <div className="overflow-hidden bg-white border border-emerald-200 rounded-xl shadow-sm animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-3 p-4 bg-emerald-50 border-b border-emerald-100">
            <svg className="w-5 h-5 shrink-0 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <div>
              <p className="font-semibold text-emerald-800">{result.message}</p>
              <p className="text-sm text-emerald-600 mt-0.5">Total added: <span className="font-bold">{result.questions_added}</span></p>
            </div>
          </div>

          {/* Row Warnings (if any rows failed) */}
          {result.errors.length > 0 && (
            <div className="p-4 bg-amber-50/50">
              <div className="flex items-center gap-2 mb-2 text-amber-700">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                <p className="text-sm font-semibold">Row Warnings ({result.errors.length})</p>
              </div>
              <ul className="text-xs text-amber-700 space-y-1 pl-6 list-disc max-h-40 overflow-y-auto">
                {result.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
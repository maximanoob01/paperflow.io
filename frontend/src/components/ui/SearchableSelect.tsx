'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface Option {
  value: string;
  label: string;
  sub?: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Search or select...',
  label,
  required,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.value === value);

  const filtered = options.filter((o) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return o.label.toLowerCase().includes(q) || (o.sub?.toLowerCase().includes(q) ?? false);
  });

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setOpen(false);
      setSearch('');
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  return (
    <div ref={ref} className="relative">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
          if (!open) setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className={`w-full flex items-center justify-between px-3 py-2.5 bg-white border rounded-xl text-sm transition-all shadow-sm ${
          open ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <span className={selected ? 'text-gray-800' : 'text-gray-400'}>
          {selected ? selected.label : placeholder}
        </span>
        <svg className={`h-4 w-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1">
          {/* Search input */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type to search subjects..."
                className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Options list */}
          <div className="max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-400">
                No subjects match &ldquo;{search}&rdquo;
              </div>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                    setSearch('');
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                    opt.value === value
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div>
                    <span className="font-medium">{opt.label}</span>
                    {opt.sub && <span className="ml-1.5 text-xs text-gray-400">({opt.sub})</span>}
                  </div>
                  {opt.value === value && (
                    <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

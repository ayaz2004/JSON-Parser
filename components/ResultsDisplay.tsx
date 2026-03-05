'use client';

import { useState } from 'react';

interface ResultsDisplayProps {
  result: any;
  fileName?: string;
}

export default function ResultsDisplay({ result, fileName }: ResultsDisplayProps) {
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(result.data || result, null, 2);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted-${fileName || 'data'}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const data = result.data || result;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-1">
            ✨ {fileName ? fileName : 'Extraction Complete'}
          </h2>
          {Array.isArray(data) && (
            <p className="text-sm text-slate-300">
              Found <span className="font-bold text-violet-400">{data.length}</span>{' '}
              {data.length === 1 ? 'item' : 'items'}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyToClipboard}
            className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 hover:border-violet-500/50 transition-all"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={downloadJson}
            className="flex items-center px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg border border-violet-500 shadow-lg hover:shadow-violet-500/50 transition-all"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download JSON
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border-2 border-slate-800 rounded-xl overflow-hidden">
        <pre className="p-6 overflow-x-auto text-sm">
          <code className="text-slate-300 font-mono">
            {jsonString}
          </code>
        </pre>
      </div>

      {result.tokensUsed && (
        <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-sm">
          <span className="text-slate-400 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Tokens Used
          </span>
          <span className="font-semibold text-violet-400">
            {result.tokensUsed.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}

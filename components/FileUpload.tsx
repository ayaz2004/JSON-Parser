'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn, formatFileSize } from '@/lib/utils';

interface FileUploadProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  hasVision?: boolean;
}

export default function FileUpload({ file, onFileSelect, hasVision = true }: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'text/plain': ['.txt'],
      'application/json': ['.json'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const removeFile = () => {
    onFileSelect(null);
  };

  return (
    <div className="w-full">
      {!file ? (
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-violet-500 bg-violet-500/10'
              : 'border-slate-700 bg-slate-900/50 hover:border-slate-600 hover:bg-slate-800/50'
          }`}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center">
            <div className="mb-4 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 p-5 border border-violet-500/30">
              <div className="rounded-full bg-slate-800 p-3">
                <svg className="w-10 h-10 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mb-2 text-slate-200">
              {isDragActive ? 'Drop your file here' : 'Upload Your Document'}
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              Drag and drop or click to browse
            </p>
            
            {/* Supported Formats */}
            <div className="flex flex-wrap gap-2 justify-center text-xs">
              <span className="px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-full border border-slate-600">PDF</span>
              <span className="px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-full border border-slate-600">TXT</span>
              <span className="px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-full border border-slate-600">JSON</span>
              <span className="px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-full border border-slate-600">DOCX</span>
            </div>
            
            {hasVision && (
              <div className="mt-4 inline-flex items-center px-3 py-1.5 bg-violet-500/10 rounded-lg border border-violet-500/30">
                <svg className="w-4 h-4 text-violet-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs font-medium text-violet-300">Vision Enabled: Images & Scanned PDFs Supported</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-slate-800 border border-slate-700 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-700 rounded-lg">
              <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-200 text-sm">{file.name}</p>
              <p className="text-xs text-slate-400">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <button
            onClick={removeFile}
            className="p-2 hover:bg-red-900/20 rounded-lg border border-transparent hover:border-red-500/50 transition-all group"
            aria-label="Remove file"
          >
            <svg className="w-5 h-5 text-slate-400 group-hover:text-red-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

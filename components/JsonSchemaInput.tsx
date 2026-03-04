'use client';

import { useState } from 'react';

interface JsonSchemaInputProps {
  schema: string;
  onSchemaChange: (schema: string) => void;
}

const exampleSchema = {
  questionOrder: 1,
  questionText: 'Question text here',
  option1: 'First option',
  option2: 'Second option',
  option3: 'Third option',
  option4: 'Fourth option',
  isCorrect: 1,
  explanation: 'Explanation text',
};

export default function JsonSchemaInput({ schema, onSchemaChange }: JsonSchemaInputProps) {
  const [error, setError] = useState<string>('');
  const isValid = !error && schema.trim();

  const handleChange = (value: string) => {
    onSchemaChange(value);
    
    // Validate JSON
    if (value.trim()) {
      try {
        JSON.parse(value);
        setError('');
      } catch (e) {
        setError('Invalid JSON format');
      }
    } else {
      setError('');
    }
  };

  const loadExample = () => {
    onSchemaChange(JSON.stringify(exampleSchema, null, 2));
    setError('');
  };

  return (
    <div className="w-full">
      <label className="flex items-center text-sm font-medium text-slate-300 mb-2">
        <div className="p-1.5 bg-violet-500/10 rounded mr-2 border border-violet-500/20">
          <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        JSON Schema (Optional)
        <button
          type="button"
          onClick={loadExample}
          className="ml-auto text-xs text-violet-400 hover:text-violet-300 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-violet-500/50 transition-all"
        >
          Load Example
        </button>
      </label>

      <textarea
        value={schema}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={`{\n  "type": "object",\n  "properties": {\n    "name": {"type": "string"},\n    "age": {"type": "number"}\n  }\n}`}
        rows={8}
        className="w-full p-3 bg-slate-900 border-2 border-slate-700 rounded-lg focus:outline-none focus:border-violet-500 transition-colors font-mono text-sm text-slate-300 placeholder:text-slate-500"
      />

      {error && (
        <div className="mt-2 p-3 bg-red-950/50 border border-red-800/50 rounded-lg">
          <p className="text-sm text-red-400 flex items-start">
            <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="flex-1">{error}</span>
          </p>
        </div>
      )}
      
      {isValid && (
        <div className="mt-2 p-2 bg-slate-800 border border-slate-700 rounded-lg">
          <p className="text-sm text-emerald-400 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Valid JSON Schema
          </p>
        </div>
      )}
      
      <div className="mt-3 p-3 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-400 leading-relaxed">
        <p>
          <strong className="text-slate-300">💡 Tip:</strong> Leave empty for free-form extraction, or provide a JSON schema to structure the output precisely (e.g., extract specific fields like "name", "date", "amount").
        </p>
      </div>
    </div>
  );
}

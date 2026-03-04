'use client';

import { LLMConfig } from '@/types';
import { useState } from 'react';

interface LLMSelectorProps {
  config: LLMConfig;
  onConfigChange: (config: LLMConfig) => void;
}

const providers = [
  { id: 'google', name: 'Google Gemini', needsKey: true, hasVision: true },
  { id: 'openai', name: 'OpenAI GPT-4o', needsKey: true, hasVision: true },
  { id: 'anthropic', name: 'Anthropic Claude', needsKey: true, hasVision: true },
  { id: 'groq', name: 'Groq', needsKey: true, hasVision: false },
  { id: 'ollama', name: 'Ollama Local', needsKey: false, hasVision: false },
];

export default function LLMSelector({ config, onConfigChange }: LLMSelectorProps) {
  const [showTempHelp, setShowTempHelp] = useState(false);
  const [showTokenHelp, setShowTokenHelp] = useState(false);
  
  const selectedProvider = providers.find((p) => p.id === config.provider);
  const needsApiKey = selectedProvider?.needsKey ?? true;
  const hasVision = selectedProvider?.hasVision ?? false;

  return (
    <div className="w-full space-y-4">
      {!hasVision && (
        <div className="p-3 bg-amber-900/20 border border-amber-700/50 rounded-lg text-sm text-amber-300">
          <svg className="w-4 h-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <strong>Note:</strong> This provider doesn't support vision. For scanned PDFs/images, switch to Gemini, OpenAI or Anthropic.
        </div>
      )}
      
      <div>
        <label className="flex items-center text-sm font-medium text-slate-300 mb-2">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          AI Provider
        </label>
        <select
          value={config.provider}
          onChange={(e) =>
            onConfigChange({
              ...config,
              provider: e.target.value as any,
            })
          }
          className="w-full p-3 bg-slate-900 border-2 border-slate-700 rounded-lg focus:outline-none focus:border-violet-500 transition-colors text-slate-200"
        >
          {providers.map((provider) => (
            <option key={provider.id} value={provider.id}>
              {provider.name}
            </option>
          ))}
        </select>
      </div>

      {needsApiKey && (
        <div>
          <label className="flex items-center text-sm font-medium text-slate-300 mb-2">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            API Key
          </label>
          <input
            type="password"
            value={config.apiKey || ''}
            onChange={(e) =>
              onConfigChange({
                ...config,
                apiKey: e.target.value,
              })
            }
            placeholder={`Enter ${selectedProvider?.name} API key`}
            className="w-full p-3 bg-slate-900 border-2 border-slate-700 rounded-lg focus:outline-none focus:border-violet-500 transition-colors text-slate-200 placeholder:text-slate-500"
            required
          />
        </div>
      )}

      {/* Advanced Settings */}
      <div className="pt-4 border-t border-slate-700">
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Advanced Settings
        </h3>
        
        <div className="space-y-4">
          {/* Temperature Control */}
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center text-sm font-medium text-slate-300">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Temperature
                <button
                  type="button"
                  onClick={() => setShowTempHelp(!showTempHelp)}
                  className="ml-2 text-slate-500 hover:text-violet-400 transition-colors"
                  aria-label="Help"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </label>
              <span className="text-sm font-semibold text-violet-400">
                {config.temperature || 0.3}
              </span>
            </div>
            
            {showTempHelp && (
              <div className="mb-3 p-5 bg-slate-800 border-2 border-slate-700 rounded-xl text-sm text-slate-300 shadow-sm transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-violet-500/10 rounded-lg flex-shrink-0 border border-violet-500/20">
                    <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-slate-200 text-base mb-1">⚡ What is Temperature?</p>
                    <p className="text-slate-400 leading-relaxed">
                      Temperature is like a "creativity dial" for AI. It controls randomness in the AI's word choices. Think of it as the difference between a careful accountant (low temp) and a creative writer (high temp).
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2.5 ml-2">
                  <div className="flex gap-2 items-start">
                    <span className="px-2 py-1 bg-slate-700 text-slate-300 font-bold text-xs rounded">0.0-0.3</span>
                    <div>
                      <p className="font-semibold text-slate-200">🎯 Precise Mode</p>
                      <p className="text-xs text-slate-400">AI picks the most likely answer every time. Consistent, factual, deterministic.</p>
                      <p className="text-xs text-slate-500 mt-0.5">→ Best for: Invoices, forms, exams, structured data extraction</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 items-start">
                    <span className="px-2 py-1 bg-slate-700 text-slate-300 font-bold text-xs rounded">0.4-0.6</span>
                    <div>
                      <p className="font-semibold text-slate-200">⚖️ Balanced Mode</p>
                      <p className="text-xs text-slate-400">Mix of accuracy and variety. Some randomness but still reliable.</p>
                      <p className="text-xs text-slate-500 mt-0.5">→ Best for: Reports, articles, general documents</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 items-start">
                    <span className="px-2 py-1 bg-slate-700 text-slate-300 font-bold text-xs rounded">0.7-1.0</span>
                    <div>
                      <p className="font-semibold text-slate-200">🎨 Creative Mode</p>
                      <p className="text-xs text-slate-400">AI explores alternative phrasings. More interpretation and variety.</p>
                      <p className="text-xs text-slate-500 mt-0.5">→ Best for: Summaries, paraphrasing, creative content</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-slate-700">
                  <p className="text-xs font-semibold text-slate-400">💡 Pro Tip: Start with 0.2 for accurate extraction, increase to 0.5-0.7 if you want more natural language in explanations</p>
                </div>
              </div>
            )}
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={config.temperature || 0.3}
              onChange={(e) =>
                onConfigChange({
                  ...config,
                  temperature: parseFloat(e.target.value),
                })
              }
              className="w-full h-2 bg-gradient-to-r from-violet-900/30 via-purple-800/30 to-fuchsia-800/30 rounded-lg appearance-none cursor-pointer slider"
            />
            
            <div className="flex justify-between text-xs font-medium mt-1">
              <span className="text-slate-400">🎯 Precise</span>
              <span className="text-slate-400">⚖️ Balanced</span>
              <span className="text-slate-400">🎨 Creative</span>
            </div>
          </div>

          {/* Max Tokens Control */}
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center text-sm font-medium text-slate-300">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Max Tokens
                <button
                  type="button"
                  onClick={() => setShowTokenHelp(!showTokenHelp)}
                  className="ml-2 text-slate-500 hover:text-violet-400 transition-colors"
                  aria-label="Help"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </label>
              <span className="text-sm font-semibold text-violet-400">
                {config.maxTokens?.toLocaleString() || '16,000'}
              </span>
            </div>
            
            {showTokenHelp && (
              <div className="mb-3 p-5 bg-slate-800 border-2 border-slate-700 rounded-xl text-sm text-slate-300 shadow-sm transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-violet-500/10 rounded-lg flex-shrink-0 border border-violet-500/20">
                    <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-slate-200 text-base mb-1">📄 What are Max Tokens?</p>
                    <p className="text-slate-400 leading-relaxed mb-2">
                      Tokens are small chunks of text. Think of them as syllables. "Hello world" = ~2 tokens. "Temperature" = ~3 tokens. On average, <strong>1 token ≈ 4 characters or 0.75 words</strong>.
                    </p>
                    <p className="text-slate-400 leading-relaxed">
                      <strong>Max Tokens</strong> sets the maximum length of the AI's response. If your document is large or has many items, you need more tokens. If set too low, results get cut off mid-sentence!
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2 ml-2">
                  <div className="flex gap-2 items-start">
                    <span className="px-2 py-1 bg-slate-700 text-slate-300 font-bold text-xs rounded whitespace-nowrap">1K-5K</span>
                    <div>
                      <p className="font-semibold text-slate-200">📝 Small Documents</p>
                      <p className="text-xs text-slate-400">~750-3,750 words • 1-7 pages • Single form, invoice, or 5-10 questions</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 items-start">
                    <span className="px-2 py-1 bg-slate-700 text-slate-300 font-bold text-xs rounded whitespace-nowrap">5K-20K</span>
                    <div>
                      <p className="font-semibold text-slate-200">📚 Medium Documents</p>
                      <p className="text-xs text-slate-400">~3,750-15,000 words • 7-30 pages • Reports, 10-50 questions with explanations</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 items-start">
                    <span className="px-2 py-1 bg-slate-700 text-slate-300 font-bold text-xs rounded whitespace-nowrap">20K-100K</span>
                    <div>
                      <p className="font-semibold text-slate-200">📊 Large Documents</p>
                      <p className="text-xs text-slate-400">~15,000-75,000 words • 30-150 pages • 100+ questions, lengthy exams, detailed reports</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-slate-700">
                  <p className="text-xs font-semibold text-slate-400">💡 Pro Tip: Start high (16K-32K) to avoid truncation. Check your output—if cut off, increase tokens. If you have 100 questions with explanations, use 50K+</p>
                </div>
              </div>
            )}
            
            <input
              type="range"
              min="1000"
              max="100000"
              step="1000"
              value={config.maxTokens || 16000}
              onChange={(e) =>
                onConfigChange({
                  ...config,
                  maxTokens: parseInt(e.target.value),
                })
              }
              className="w-full h-2 bg-gradient-to-r from-violet-900/30 via-purple-800/30 to-fuchsia-800/30 rounded-lg appearance-none cursor-pointer slider"
            />
            
            <div className="flex justify-between text-xs font-medium mt-1">
              <span className="text-slate-400">1K</span>
              <span className="text-slate-400">50K</span>
              <span className="text-slate-400">100K</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

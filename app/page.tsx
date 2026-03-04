'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import JsonSchemaInput from '@/components/JsonSchemaInput';
import LLMSelector from '@/components/LLMSelector';
import ResultsDisplay from '@/components/ResultsDisplay';
import { LLMConfig } from '@/types';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [schema, setSchema] = useState<string>('');
  const [llmConfig, setLlmConfig] = useState<LLMConfig>({
    provider: 'google',
    apiKey: '',
    temperature: 0.3,
    maxTokens: 16384,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  // Determine if current provider supports vision
  const providers = [
    { id: 'google', hasVision: true },
    { id: 'openai', hasVision: true },
    { id: 'anthropic', hasVision: true },
    { id: 'groq', hasVision: false },
    { id: 'ollama', hasVision: false },
  ];
  const hasVision = providers.find(p => p.id === llmConfig.provider)?.hasVision ?? false;

  const handleParse = async () => {
    setError('');
    setResult(null);

    // Validation
    if (!file) {
      setError('❌ Please upload a document file (PDF, DOC, or Image)');
      return;
    }

    if (!schema) {
      setError('❌ Please provide a JSON schema (click "Load Example" to start)');
      return;
    }

    // Validate JSON schema
    try {
      JSON.parse(schema);
    } catch {
      setError('❌ Invalid JSON format in schema. Please check your JSON syntax.');
      return;
    }

    // Validate API key for providers that need it
    if (llmConfig.provider !== 'ollama' && !llmConfig.apiKey) {
      setError(`❌ API key is required for ${llmConfig.provider}. Click the "Get ${llmConfig.provider.charAt(0).toUpperCase() + llmConfig.provider.slice(1)} Key" link above to get one.`);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('schema', schema);
      formData.append('llmConfig', JSON.stringify(llmConfig));

      const response = await fetch('/api/parse', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to parse document');
      }

      setResult(data.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(`❌ ${errorMessage}`);
      console.error('Parse error details:', err);
      
      // Log detailed information for debugging
      console.log('Request details:', {
        hasFile: !!file,
        fileName: file?.name,
        fileType: file?.type,
        hasSchema: !!schema,
        schemaLength: schema?.length,
        provider: llmConfig.provider,
        hasApiKey: !!llmConfig.apiKey
      });
    } finally {
      setLoading(false);
    }
  };

  const canProcess = file && schema && (llmConfig.provider === 'ollama' || llmConfig.apiKey);

  return (
    <main className="min-h-screen bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <svg className="w-12 h-12 text-violet-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                <circle cx="12" cy="12" r="10" strokeWidth={1.5} opacity={0.3} />
              </svg>
              <div className="absolute inset-0 w-12 h-12 bg-violet-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-slate-100 mb-3">
            AI Document Parser
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Transform any document into structured JSON using powerful AI vision models.
            <span className="block text-sm text-slate-400 mt-1">
              ✨ Supports scanned PDFs, images, and text documents
            </span>
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-violet-500/10 rounded-lg border border-violet-500/20">
                    <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </span>
                  Upload Document
                </h2>
                <FileUpload file={file} onFileSelect={setFile} hasVision={hasVision} />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-violet-500/10 rounded-lg border border-violet-500/20">
                    <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </span>
                  Define Output Schema
                </h2>
                <JsonSchemaInput schema={schema} onSchemaChange={setSchema} />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-violet-500/10 rounded-lg border border-violet-500/20">
                    <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </span>
                  Configure AI Model
                </h2>
                <LLMSelector config={llmConfig} onConfigChange={setLlmConfig} />
              </div>
              
              {/* Info Box */}
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  API Keys
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Get your API keys from the provider websites.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href="https://console.groq.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-slate-700/50 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-600 transition-all hover:border-violet-500/50"
                  >
                    Groq →
                  </a>
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-slate-700/50 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-600 transition-all hover:border-violet-500/50"
                  >
                    OpenAI →
                  </a>
                  <a
                    href="https://makersuite.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-slate-700/50 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-600 transition-all hover:border-violet-500/50"
                  >
                    Gemini →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Process Button */}
          <div className="flex flex-col items-center mt-8">
            <button
              onClick={handleParse}
              disabled={!canProcess || loading}
              className="group relative flex items-center px-10 py-5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-lg font-semibold rounded-xl shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 disabled:transform-none"
            >
              <div className="absolute inset-0 bg-violet-600 rounded-xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative flex items-center">
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    Processing Document...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Parse Document with AI
                  </>
                )}
              </div>
            </button>
            
            {!canProcess && !loading && (
              <div className="mt-4 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg">
                <p className="text-sm text-slate-400 text-center">
                  {!file && '👆 Upload a file to get started'}
                  {file && !schema && '👆 Define your JSON schema'}
                  {file && schema && llmConfig.provider !== 'ollama' && !llmConfig.apiKey && '👆 Add your API key'}
                </p>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-6 p-4 bg-red-950 border-2 border-red-800 rounded-lg animate-pulse">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-400 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <h3 className="font-semibold text-red-300 mb-1">Error</h3>
                  <p className="text-red-400 text-sm whitespace-pre-line">{error}</p>
                  
                  {/* Show converter links if it's a scanned PDF error */}
                  {error.includes('scanned document') && (
                    <div className="mt-3 p-3 bg-gray-900 rounded border border-gray-700">
                      <p className="text-xs font-semibold text-gray-300 mb-2">🔧 Convert Tools:</p>
                      <div className="flex flex-wrap gap-2">
                        <a
                          href="https://pdf2png.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded transition-colors border border-gray-700"
                        >
                          PDF2PNG.com →
                        </a>
                        <a
                          href="https://www.ilovepdf.com/pdf_to_jpg"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded transition-colors border border-gray-700"
                        >
                          iLovePDF →
                        </a>
                        <a
                          href="https://smallpdf.com/pdf-to-jpg"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded transition-colors border border-gray-700"
                        >
                          SmallPDF →
                        </a>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        After converting, upload the image files here for automatic OCR processing
                      </p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setError('')}
                  className="text-red-400 hover:text-red-300 ml-2 text-xl leading-none"
                  aria-label="Dismiss error"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl p-8">
            <ResultsDisplay result={result} />
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-slate-500">
          <p>
            Supports OpenAI, Claude, Gemini, Groq, and local Ollama models
          </p>
          <p className="mt-2">
            Built with Next.js, React, and Tailwind CSS
          </p>
        </div>
      </div>
    </main>
  );
}

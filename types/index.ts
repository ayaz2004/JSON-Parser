export interface ParsedDocument {
  text: string;
  metadata?: {
    pageCount?: number;
    format: string;
    size: number;
    [key: string]: any; // Allow additional metadata fields
  };
  rawBuffer?: Buffer; // For vision-enabled LLMs to process directly
  isScanned?: boolean; // Indicates if document is scanned/image-based
}

export interface LLMConfig {
  provider: 'openai' | 'anthropic' | 'google' | 'groq' | 'ollama';
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LLMProvider {
  name: string;
  generate(prompt: string, config: LLMConfig): Promise<string>;
  validateConfig(config: LLMConfig): boolean;
}

export interface ConversionRequest {
  documentText: string;
  outputSchema: any;
  llmConfig: LLMConfig;
}

export interface ConversionResult {
  success: boolean;
  data?: any;
  error?: string;
}

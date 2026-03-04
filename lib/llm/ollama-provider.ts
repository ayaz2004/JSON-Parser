import { LLMConfig } from '@/types';
import { BaseLLMProvider } from './base-provider';
import axios from 'axios';

export class OllamaProvider extends BaseLLMProvider {
  name = 'Ollama';
  
  validateConfig(config: LLMConfig): boolean {
    // Ollama runs locally, no API key needed
    return true;
  }
  
  async generate(prompt: string, config: LLMConfig): Promise<string> {
    const baseURL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    const model = config.model || process.env.OLLAMA_MODEL || 'llama2';
    
    try {
      const response = await axios.post(`${baseURL}/api/generate`, {
        model,
        prompt,
        stream: false,
        options: {
          temperature: config.temperature || 0.3,
          num_predict: config.maxTokens || 4000,
        },
      });
      
      return response.data.response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error('Ollama is not running. Please start Ollama service.');
        }
        throw new Error(`Ollama API error: ${error.message}`);
      }
      throw new Error(`Ollama error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

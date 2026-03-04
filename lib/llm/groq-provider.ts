import { LLMConfig } from '@/types';
import { BaseLLMProvider } from './base-provider';
import Groq from 'groq-sdk';

export class GroqProvider extends BaseLLMProvider {
  name = 'Groq';
  
  validateConfig(config: LLMConfig): boolean {
    return !!config.apiKey;
  }
  
  async generate(prompt: string, config: LLMConfig): Promise<string> {
    if (!this.validateConfig(config)) {
      throw new Error('Groq API key is required');
    }
    
    const groq = new Groq({
      apiKey: config.apiKey,
    });
    
    const model = config.model || process.env.GROQ_MODEL || 'mixtral-8x7b-32768';
    
    try {
      const completion = await groq.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are a precise data extraction assistant. Always return valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: config.temperature || 0.3,
        max_tokens: config.maxTokens || 4000,
      });
      
      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      throw new Error(`Groq API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

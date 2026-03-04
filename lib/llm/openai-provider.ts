import { LLMConfig } from '@/types';
import { BaseLLMProvider } from './base-provider';
import OpenAI from 'openai';

export class OpenAIProvider extends BaseLLMProvider {
  name = 'OpenAI';
  
  validateConfig(config: LLMConfig): boolean {
    return !!config.apiKey;
  }
  
  async generateWithVision(imageBuffer: Buffer, schema: any, config: LLMConfig): Promise<string> {
    if (!this.validateConfig(config)) {
      throw new Error('OpenAI API key is required');
    }
    
    const openai = new OpenAI({
      apiKey: config.apiKey,
    });
    
    const model = config.model || 'gpt-4o'; // Use GPT-4 Vision
    const base64Image = imageBuffer.toString('base64');
    const mimeType = this.detectMimeType(imageBuffer);
    
    const prompt = `Extract all text and data from this document and convert it to the following JSON format:

${JSON.stringify(schema, null, 2)}

Rules:
- Extract ALL visible information accurately
- Match the exact field names from the schema
- For dates, use ISO 8601 format (YYYY-MM-DD)
- For numbers, use numeric types (no quotes)
- If a field is not found, use null
- Return ONLY valid JSON, no other text`;
    
    try {
      const completion = await openai.chat.completions.create({
        model,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        temperature: config.temperature || 0.3,
        max_tokens: config.maxTokens || 4000,
      });
      
      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      throw new Error(`OpenAI Vision API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  private detectMimeType(buffer: Buffer): string {
    // Simple magic number detection
    const header = buffer.toString('hex', 0, 4).toUpperCase();
    if (header.startsWith('FFD8FF')) return 'image/jpeg';
    if (header.startsWith('89504E47')) return 'image/png';
    if (header.startsWith('25504446')) return 'application/pdf';
    return 'image/png'; // default
  }
  
  async generate(prompt: string, config: LLMConfig): Promise<string> {
    if (!this.validateConfig(config)) {
      throw new Error('OpenAI API key is required');
    }
    
    const openai = new OpenAI({
      apiKey: config.apiKey,
    });
    
    const model = config.model || process.env.OPENAI_MODEL || 'gpt-4-turbo-preview';
    
    try {
      const completion = await openai.chat.completions.create({
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
        response_format: { type: 'json_object' },
      });
      
      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      throw new Error(`OpenAI API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

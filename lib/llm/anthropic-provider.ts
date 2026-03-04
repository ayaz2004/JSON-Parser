import { LLMConfig } from '@/types';
import { BaseLLMProvider } from './base-provider';
import Anthropic from '@anthropic-ai/sdk';

export class AnthropicProvider extends BaseLLMProvider {
  name = 'Anthropic';
  
  validateConfig(config: LLMConfig): boolean {
    return !!config.apiKey;
  }
  
  async generateWithVision(imageBuffer: Buffer, schema: any, config: LLMConfig): Promise<string> {
    if (!this.validateConfig(config)) {
      throw new Error('Anthropic API key is required');
    }
    
    const anthropic = new Anthropic({
      apiKey: config.apiKey,
    });
    
    const model = config.model || 'claude-3-5-sonnet-20241022'; // Use latest Claude with vision
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
      const message = await anthropic.messages.create({
        model,
        max_tokens: config.maxTokens || 4000,
        temperature: config.temperature || 0.3,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mimeType as any,
                  data: base64Image,
                },
              },
              {
                type: 'text',
                text: prompt,
              },
            ],
          },
        ],
      });
      
      const content = message.content[0];
      return content.type === 'text' ? content.text : '';
    } catch (error) {
      throw new Error(`Anthropic Vision API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  private detectMimeType(buffer: Buffer): string {
    const header = buffer.toString('hex', 0, 4).toUpperCase();
    if (header.startsWith('FFD8FF')) return 'image/jpeg';
    if (header.startsWith('89504E47')) return 'image/png';
    if (header.startsWith('47494638')) return 'image/gif';
    if (header.startsWith('52494646')) return 'image/webp';
    return 'image/png'; // default
  }
  
  async generate(prompt: string, config: LLMConfig): Promise<string> {
    if (!this.validateConfig(config)) {
      throw new Error('Anthropic API key is required');
    }
    
    const anthropic = new Anthropic({
      apiKey: config.apiKey,
    });
    
    const model = config.model || process.env.ANTHROPIC_MODEL || 'claude-3-sonnet-20240229';
    
    try {
      const message = await anthropic.messages.create({
        model,
        max_tokens: config.maxTokens || 4000,
        temperature: config.temperature || 0.3,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });
      
      const content = message.content[0];
      return content.type === 'text' ? content.text : '';
    } catch (error) {
      throw new Error(`Anthropic API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

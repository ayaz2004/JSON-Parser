import { LLMConfig } from '@/types';
import { BaseLLMProvider } from './base-provider';
import { OpenAIProvider } from './openai-provider';
import { AnthropicProvider } from './anthropic-provider';
import { GoogleProvider } from './google-provider';
import { GroqProvider } from './groq-provider';
import { OllamaProvider } from './ollama-provider';

const providers: Record<string, BaseLLMProvider> = {
  openai: new OpenAIProvider(),
  anthropic: new AnthropicProvider(),
  google: new GoogleProvider(),
  groq: new GroqProvider(),
  ollama: new OllamaProvider(),
};

export function getProvider(providerName: string): BaseLLMProvider {
  const provider = providers[providerName.toLowerCase()];
  if (!provider) {
    throw new Error(`Unknown provider: ${providerName}`);
  }
  return provider;
}

export async function convertToJSON(
  documentText: string,
  schema: any,
  config: LLMConfig,
  imageBuffer?: Buffer
): Promise<any> {
  const provider = getProvider(config.provider);
  
  if (!provider.validateConfig(config)) {
    throw new Error(`Invalid configuration for ${provider.name}`);
  }
  
  // If we have an image buffer and provider supports vision, use vision API
  if (imageBuffer && typeof (provider as any).generateWithVision === 'function') {
    console.log(`Using ${provider.name} vision API for direct document processing...`);
    const response = await (provider as any).generateWithVision(imageBuffer, schema, config);
    return extractJSON(response);
  }
  
  // Fall back to text-based processing
  const prompt = (provider as any).buildPrompt(documentText, schema);
  const response = await provider.generate(prompt, config);
  
  // Extract JSON from response
  return extractJSON(response);
}

function extractJSON(text: string): any {
  console.log('Attempting to extract JSON from response (length:', text.length, ')');
  
  // Try to extract JSON from markdown code blocks (```json or ```)
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || 
                    text.match(/```\s*([\s\S]*?)\s*```/);
  
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[1].trim());
      console.log('✅ Successfully parsed JSON from code block');
      return parsed;
    } catch (e) {
      console.log('❌ Failed to parse JSON from code block:', e);
    }
  }
  
  // Try to parse the entire text as JSON
  try {
    const parsed = JSON.parse(text.trim());
    console.log('✅ Successfully parsed entire response as JSON');
    return parsed;
  } catch (e) {
    console.log('❌ Failed to parse entire text as JSON');
  }
  
  // Try to find JSON array in the text
  const arrayMatch = text.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    try {
      const parsed = JSON.parse(arrayMatch[0]);
      console.log('✅ Successfully parsed JSON array from text');
      return parsed;
    } catch (e) {
      console.log('❌ Failed to parse array match:', e);
    }
  }
  
  // Try to find JSON object in the text (greedy match)
  const objectMatch = text.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    try {
      const parsed = JSON.parse(objectMatch[0]);
      console.log('✅ Successfully parsed JSON object from text');
      return parsed;
    } catch (e) {
      console.log('❌ Failed to parse object match:', e);
    }
  }
  
  console.error('❌ Could not extract valid JSON. Response preview:', text.substring(0, 200));
  throw new Error('Could not extract valid JSON from LLM response');
}

export { BaseLLMProvider };

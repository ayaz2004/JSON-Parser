import { LLMConfig } from '@/types';
import { BaseLLMProvider } from './base-provider';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

export class GoogleProvider extends BaseLLMProvider {
  name = 'Google';
  
  validateConfig(config: LLMConfig): boolean {
    return !!config.apiKey;
  }
  
  async generateWithVision(imageBuffer: Buffer, schema: any, config: LLMConfig): Promise<string> {
    if (!this.validateConfig(config)) {
      throw new Error('Google API key is required');
    }
    
    const genAI = new GoogleGenerativeAI(config.apiKey!);
    // Use models compatible with Google AI Studio API keys
    const modelName = config.model || 'gemini-2.5-flash';
    const model = genAI.getGenerativeModel({
      model: modelName,
    });
    
    console.log(`Using Google Gemini model: ${modelName}`);
    
    
    const prompt = `Extract all text and data from this document and convert it to the following JSON format:

${JSON.stringify(schema, null, 2)}

Rules:
- Extract ALL visible information accurately (questions, options, etc.)
- Match the exact field names from the schema
- For dates, use ISO 8601 format (YYYY-MM-DD)
- For numbers, use numeric types (no quotes)
- For "isCorrect" field: Use your knowledge to determine the correct answer (1, 2, 3, or 4 corresponding to option1, option2, option3, option4)
- For "explanation" field: Provide a detailed explanation of why that answer is correct
- If you cannot determine the answer with confidence, set isCorrect to null and explanation to null
- Return ONLY valid JSON, no other text`;
    
    try {
      const mimeType = this.detectMimeType(imageBuffer);
      const base64Image = imageBuffer.toString('base64');
      
      const result = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: base64Image,
                },
              },
              { text: prompt },
            ],
          },
        ],
        generationConfig: {
          temperature: config.temperature || 0.3,
          maxOutputTokens: config.maxTokens || 16384,
        },
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ],
      });
      
      const response = await result.response;
      const responseText = response.text();
      console.log('Gemini response length:', responseText.length, 'chars');
      console.log('Gemini response preview:', responseText.substring(0, 300));
      console.log('Gemini response ending:', responseText.substring(Math.max(0, responseText.length - 100)));
      return responseText;
    } catch (error: any) {
      // Provide helpful error message
      let errorMsg = error?.message || 'Unknown error';
      if (errorMsg.includes('not found') || errorMsg.includes('404')) {
        errorMsg = `Model not available. Try: 1) Check API key has access to vision models, 2) Use OpenAI or Anthropic instead. Original error: ${errorMsg}`;
      }
      throw new Error(`Google Vision API error: ${errorMsg}`);
    }
  }
  
  private detectMimeType(buffer: Buffer): string {
    const header = buffer.toString('hex', 0, 4).toUpperCase();
    if (header.startsWith('FFD8FF')) return 'image/jpeg';
    if (header.startsWith('89504E47')) return 'image/png';
    if (header.startsWith('47494638')) return 'image/gif';
    if (header.startsWith('52494646')) return 'image/webp';
    if (header.startsWith('25504446')) return 'application/pdf';
    return 'image/png'; // default
  }
  
  async generate(prompt: string, config: LLMConfig): Promise<string> {
    if (!this.validateConfig(config)) {
      throw new Error('Google API key is required');
    }
    
    const genAI = new GoogleGenerativeAI(config.apiKey!);
    const model = genAI.getGenerativeModel({
      model: config.model || 'gemini-2.5-flash', // Compatible with AI Studio
    });
    
    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: config.temperature || 0.3,
          maxOutputTokens: config.maxTokens || 4000,
        },
      });
      
      const response = await result.response;
      return response.text();
    } catch (error) {
      throw new Error(`Google API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

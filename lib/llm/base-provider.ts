import { LLMConfig, LLMProvider } from '@/types';

export abstract class BaseLLMProvider implements LLMProvider {
  abstract name: string;
  
  abstract generate(prompt: string, config: LLMConfig): Promise<string>;
  
  abstract validateConfig(config: LLMConfig): boolean;
  
  protected buildPrompt(documentText: string, schema: any): string {
    const schemaStr = JSON.stringify(schema, null, 2);
    
    return `You are a data extraction expert. Extract information from the following document and format it according to the provided JSON schema.

DOCUMENT TEXT:
${documentText}

REQUIRED JSON SCHEMA:
${schemaStr}

INSTRUCTIONS:
1. Extract relevant information from the document
2. Format the output EXACTLY according to the provided schema
3. If the document contains multiple items (like multiple questions), return an array of objects
4. Ensure all required fields are filled
5. For the "isCorrect" field: Use your knowledge to determine the correct answer (1, 2, 3, or 4 corresponding to option1, option2, option3, option4)
6. For the "explanation" field: Provide a brief explanation (1-2 sentences) of why that answer is correct
7. If you cannot determine the answer with confidence, set isCorrect to null and explanation to null
8. Return ONLY valid JSON, no additional text or markdown

OUTPUT (JSON only):`;
  }
}

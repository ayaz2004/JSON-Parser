import { ParsedDocument } from '@/types';
import mammoth from 'mammoth';

export async function parseDOC(buffer: Buffer): Promise<ParsedDocument> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    
    return {
      text: result.value,
      metadata: {
        format: 'docx',
        size: buffer.length,
      },
    };
  } catch (error) {
    throw new Error(`Failed to parse DOC/DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

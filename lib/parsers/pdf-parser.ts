import { ParsedDocument } from '@/types';
import pdfParse from 'pdf-parse';

export async function parsePDF(buffer: Buffer): Promise<ParsedDocument> {
  try {
    const data = await pdfParse(buffer);
    
    return {
      text: data.text,
      metadata: {
        pageCount: data.numpages,
        format: 'pdf',
        size: buffer.length,
      },
    };
  } catch (error) {
    throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

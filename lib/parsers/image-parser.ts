import { ParsedDocument } from '@/types';
const Tesseract = require('tesseract.js');

export async function parseImage(buffer: Buffer): Promise<ParsedDocument> {
  try {
    // Use recognize directly without worker for server-side
    const result = await Tesseract.recognize(
      buffer,
      'eng',
      {
        logger: (m: any) => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        },
      }
    );
    
    return {
      text: result.data.text,
      metadata: {
        format: 'image',
        size: buffer.length,
      },
    };
  } catch (error) {
    throw new Error(`Failed to parse image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

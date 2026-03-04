import { ParsedDocument } from '@/types';
import { parsePDF } from './pdf-parser';
import { parseDOC } from './doc-parser';


export async function parseDocument(
  file: Buffer,
  mimeType: string
): Promise<ParsedDocument> {
  const type = mimeType.toLowerCase();
  
  if (type === 'application/pdf') {
    // Try normal PDF parsing first
    const pdfResult = await parsePDF(file);
    
    // If no text extracted, it's likely a scanned PDF
    if (!pdfResult.text || pdfResult.text.trim().length < 50) {
      console.log('Scanned PDF detected - will use vision-enabled LLM or OCR fallback');
      return {
        text: '', // Empty for now, LLM will extract directly
        rawBuffer: file,
        isScanned: true,
        metadata: {
          format: 'pdf-scanned',
          size: file.length,
        },
      };
    }
    
    return pdfResult;
  }
  
  if (
    type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    type === 'application/msword'
  ) {
    return parseDOC(file);
  }
  
  if (type.startsWith('image/')) {
    console.log('Image detected - will use vision-enabled LLM or OCR fallback');
    return {
      text: '', // Empty for now, LLM will extract directly
      rawBuffer: file,
      isScanned: true,
      metadata: {
        format: 'image',
        size: file.length,
      },
    };
  }
  
  throw new Error(`Unsupported file type: ${mimeType}`);
}

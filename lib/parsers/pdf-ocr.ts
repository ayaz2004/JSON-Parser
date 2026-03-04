import { ParsedDocument } from '@/types';

export async function parsePDFWithOCR(buffer: Buffer): Promise<ParsedDocument> {
  console.log('Starting online OCR for scanned PDF...');
  
  try {
    // Use OCR.space free API for scanned PDFs
    const formData = new FormData();
    const uint8Array = new Uint8Array(buffer);
    const blob = new Blob([uint8Array], { type: 'application/pdf' });
    formData.append('file', blob, 'document.pdf');
    formData.append('apikey', 'helloworld'); // Free tier API key (limited requests)
    formData.append('language', 'eng');
    formData.append('isOverlayRequired', 'false');
    formData.append('detectOrientation', 'true');
    formData.append('scale', 'true');
    formData.append('OCREngine', '2'); // Engine 2 is better for PDFs
    formData.append('filetype', 'PDF');
    
    console.log('Sending PDF to OCR.space API...');
    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`OCR API returned ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.OCRExitCode === 1 && result.ParsedResults && result.ParsedResults.length > 0) {
      const text = result.ParsedResults
        .map((r: any) => r.ParsedText || '')
        .join('\n\n')
        .trim();
      
      if (text.length > 50) {
        console.log(`OCR successful: ${text.length} characters extracted`);
        return {
          text: text,
          metadata: {
            format: 'pdf-online-ocr',
            size: buffer.length,
            ocrEngine: 'OCR.space',
          },
        };
      }
    }
    
    // Check for API errors
    if (result.ErrorMessage && result.ErrorMessage.length > 0) {
      console.error('OCR API errors:', result.ErrorMessage);
      if (result.ErrorMessage[0].includes('Rate limit')) {
        throw new Error('RATE_LIMIT');
      }
    }
    
    throw new Error('INSUFFICIENT_TEXT');
  } catch (error: any) {
    console.error('Online OCR failed:', error.message);
    
    // Provide helpful error messages based on failure reason
    if (error.message === 'RATE_LIMIT') {
      throw new Error(
        '⏰ Free OCR service rate limit reached.\n\n' +
        '✅ Two options:\n' +
        '1. Wait a few minutes and try again\n' +
        '2. Convert PDF to images: https://pdf2png.com\n' +
        '   Then upload images here for unlimited OCR\n\n' +
        '💡 Image OCR is faster and has no limits!'
      );
    }
    
    // Default guidance for conversion
    throw new Error(
      '📄 Automatic PDF OCR unavailable (free service limit).\n\n' +
      '✅ Quick 2-Minute Fix:\n' +
      '1. Visit https://pdf2png.com (no signup needed)\n' +
      '2. Drop your PDF → Download images\n' +
      '3. Upload images here for instant OCR ✨\n\n' +
      '💡 Image OCR works perfectly and gives better accuracy!'
    );
  }
}

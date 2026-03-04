import { NextRequest, NextResponse } from 'next/server';
import { parseDocument } from '@/lib/parsers';
import { convertToJSON } from '@/lib/llm';
import { LLMConfig } from '@/types';

export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds timeout

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const file = formData.get('file') as File;
    const schema = formData.get('schema') as string;
    const llmConfig = formData.get('llmConfig') as string;
    
    // Validate inputs
    if (!file) {
      console.error('Validation error: No file provided');
      return NextResponse.json(
        { success: false, error: 'No file provided. Please upload a PDF, DOC, or image file.' },
        { status: 400 }
      );
    }
    
    if (!schema) {
      console.error('Validation error: No schema provided');
      return NextResponse.json(
        { success: false, error: 'No JSON schema provided. Please define your output format.' },
        { status: 400 }
      );
    }
    
    if (!llmConfig) {
      console.error('Validation error: No LLM config provided');
      return NextResponse.json(
        { success: false, error: 'No LLM configuration provided. Please select a provider and add an API key.' },
        { status: 400 }
      );
    }
    
    // Parse schema and config
    let parsedSchema: any;
    let parsedConfig: LLMConfig;
    
    try {
      parsedSchema = JSON.parse(schema);
      parsedConfig = JSON.parse(llmConfig);
    } catch (e) {
      console.error('JSON parse error:', e);
      return NextResponse.json(
        { success: false, error: 'Invalid JSON format in schema or configuration.' },
        { status: 400 }
      );
    }
    
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Parse document
    console.log('Parsing document:', file.name, file.type);
    const parsedDoc = await parseDocument(buffer, file.type);
    
    // If document is scanned and has raw buffer, try vision-enabled LLM first
    if (parsedDoc.isScanned && parsedDoc.rawBuffer) {
      console.log('Scanned document detected - using vision-enabled LLM for direct extraction');
      
      try {
        const result = await convertToJSON(
          '', // No text needed for vision
          parsedSchema,
          parsedConfig,
          parsedDoc.rawBuffer
        );
        
        console.log('Vision-based extraction successful');
        return NextResponse.json({
          success: true,
          data: result,
          metadata: {
            ...parsedDoc.metadata,
            extractionMethod: 'vision-llm',
          },
        });
      } catch (visionError) {
        console.error('Vision extraction failed:', visionError);
        console.log('Attempting Tesseract OCR fallback...');
        
        // Try local Tesseract OCR as fallback
        try {
          const { parseImage } = await import('@/lib/parsers/image-parser');
          
          const isImage = file.type.startsWith('image/');
          
          if (isImage) {
            // For images, use Tesseract directly
            const ocrResult = await parseImage(parsedDoc.rawBuffer!);
            
            if (ocrResult.text && ocrResult.text.trim().length > 50) {
              console.log('Tesseract OCR successful, converting to JSON...');
              const result = await convertToJSON(
                ocrResult.text,
                parsedSchema,
                parsedConfig
              );
              
              return NextResponse.json({
                success: true,
                data: result,
                metadata: {
                  ...ocrResult.metadata,
                  extractionMethod: 'tesseract-ocr',
                },
              });
            }
          } else {
            // For PDFs, guide user to convert to images
            throw new Error('PDF_NEEDS_CONVERSION');
          }
        } catch (ocrError: any) {
          console.error('OCR fallback failed:', ocrError);
          
          if (ocrError.message === 'PDF_NEEDS_CONVERSION') {
            return NextResponse.json(
              { 
                success: false, 
                error: '📄 Vision API failed. Please convert your PDF to images first:\n\n' +
                       '1. Visit https://pdf2png.com\n' +
                       '2. Convert your PDF to JPG/PNG\n' +
                       '3. Upload the images here\n\n' +
                       'Tip: Use OpenAI or Anthropic for direct PDF processing!'
              },
              { status: 400 }
            );
          }
        }
        
        // If everything fails, return helpful error
        const visionErrorMsg = visionError instanceof Error ? visionError.message : String(visionError);
        
        return NextResponse.json(
          { 
            success: false, 
            error: `Could not process scanned document with vision API. ${visionErrorMsg}`
          },
          { status: 400 }
        );
      }
    }
    
    if (!parsedDoc.text || parsedDoc.text.trim().length === 0) {
      console.error('Document parsing resulted in empty text');
      return NextResponse.json(
        { success: false, error: 'Could not extract text from document. The file might be empty or corrupted.' },
        { status: 400 }
      );
    }
    
    console.log('Document parsed successfully. Text length:', parsedDoc.text.length);
    
    // Convert to JSON using LLM
    console.log('Converting to JSON using', parsedConfig.provider);
    const result = await convertToJSON(
      parsedDoc.text,
      parsedSchema,
      parsedConfig
    );
    
    console.log('Conversion successful');
    return NextResponse.json({
      success: true,
      data: result,
      metadata: parsedDoc.metadata,
    });
  } catch (error) {
    console.error('Parse error:', error);
    
    // Provide user-friendly error messages
    let errorMessage = 'Unknown error occurred';
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Client errors (user can fix) - use 400 status
      if (errorMessage.includes('manual conversion') || errorMessage.includes('scanned PDF')) {
        // This is expected for scanned PDFs - not a server error
        statusCode = 400;
      } else if (errorMessage.includes('API key')) {
        errorMessage = 'Invalid or missing API key. Please check your API key and try again.';
        statusCode = 400;
      } else if (errorMessage.includes('rate limit')) {
        errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
        statusCode = 429;
      } else if (errorMessage.includes('quota')) {
        errorMessage = 'API quota exceeded. Please check your account billing or try a different provider.';
        statusCode = 402;
      } else if (errorMessage.includes('Ollama')) {
        errorMessage = 'Cannot connect to Ollama. Make sure Ollama is installed and running (ollama serve).';
        statusCode = 503;
      }
    }
    
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: statusCode }
    );
  }
}

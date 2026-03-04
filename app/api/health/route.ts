import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    providers: ['openai', 'anthropic', 'google', 'groq', 'ollama'],
  });
}

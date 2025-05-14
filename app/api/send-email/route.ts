import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, tasks, date } = await req.json();

    const zapierRes = await fetch('https://hooks.zapier.com/hooks/catch/22923427/272zs5y/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, tasks, date }),
    });

    if (!zapierRes.ok) {
      const errorText = await zapierRes.text();
      return NextResponse.json({ error: errorText }, { status: zapierRes.status });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('API Route Error:', err);
    return NextResponse.json({ error: err.message || 'Unexpected error' }, { status: 500 });
  }
}
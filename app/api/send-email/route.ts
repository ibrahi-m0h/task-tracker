import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, tasks, date } = body;

    // Validate the request body
    if (!email || !tasks || !Array.isArray(tasks) || tasks.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Send to Zapier webhook
    const response = await fetch('https://hooks.zapier.com/hooks/catch/22923427/272zs5y/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, tasks, date }),
    });

    if (!response.ok) {
      throw new Error('Failed to send to Zapier');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
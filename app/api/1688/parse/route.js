import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PARSER_API_URL = process.env.PARSER_API_URL || 'http://23.27.240.176:3001/parse-1688';

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Missing 1688 product URL.' }, { status: 400 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 70000);

    const response = await fetch(PARSER_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
      cache: 'no-store',
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || '1688 parser API failed.', detail: data },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Unable to call the 1688 parser API.',
        detail: error.name === 'AbortError' ? 'Parser request timed out.' : error.message,
      },
      { status: 500 },
    );
  }
}

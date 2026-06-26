import { NextResponse } from 'next/server';
import { FALLBACK_IMAGE } from '../../../lib/imageUtils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const svg = decodeURIComponent(FALLBACK_IMAGE.replace('data:image/svg+xml;utf8,', ''));

  return new NextResponse(svg, {
    status: 200,
    headers: {
      'content-type': 'image/svg+xml; charset=utf-8',
      'cache-control': 'public, max-age=86400',
    },
  });
}

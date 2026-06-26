import { NextResponse } from 'next/server';
import { normalizeImageUrl } from '../../../lib/imageUtils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_HOSTS = /(alicdn|1688|alibaba|tbcdn|alicdn-inc)/i;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sourceUrl = normalizeImageUrl(searchParams.get('url') || '');

    if (!sourceUrl) {
      return NextResponse.json({ error: 'Missing image url.' }, { status: 400 });
    }

    const parsed = new URL(sourceUrl);
    if (!ALLOWED_HOSTS.test(parsed.hostname)) {
      return NextResponse.json({ error: 'Image host is not allowed.' }, { status: 400 });
    }

    const response = await fetch(sourceUrl, {
      headers: {
        accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        referer: 'https://detail.1688.com/',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36',
      },
      cache: 'force-cache',
    });

    if (!response.ok) {
      return NextResponse.redirect(new URL('/api/image-placeholder', request.url), 302);
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    if (!contentType.startsWith('image/')) {
      return NextResponse.redirect(new URL('/api/image-placeholder', request.url), 302);
    }

    const body = await response.arrayBuffer();

    return new NextResponse(body, {
      status: 200,
      headers: {
        'content-type': contentType,
        'cache-control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Image proxy failed.', detail: error.message }, { status: 500 });
  }
}

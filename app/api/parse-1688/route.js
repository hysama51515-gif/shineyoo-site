import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Missing 1688 product URL.' }, { status: 400 });
    }

    if (!/^https?:\/\/.+1688\.com/i.test(url)) {
      return NextResponse.json({ error: 'Please paste a valid 1688 product URL.' }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.7',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `1688 page request failed with status ${response.status}.` },
        { status: 502 },
      );
    }

    const html = await response.text();
    const parsed = parse1688Html(html, url);

    return NextResponse.json(parsed);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          'Unable to parse this 1688 page. It may require login, captcha, or block server-side requests.',
        detail: error.message,
      },
      { status: 500 },
    );
  }
}

function parse1688Html(html, sourceUrl) {
  const cleanHtml = html.replace(/\\\//g, '/').replace(/&amp;/g, '&');
  const title =
    pickMeta(cleanHtml, 'og:title') ||
    pickMeta(cleanHtml, 'twitter:title') ||
    pickTitle(cleanHtml) ||
    'Imported 1688 Product';

  const description =
    pickMeta(cleanHtml, 'description') ||
    pickMeta(cleanHtml, 'og:description') ||
    `${title} — imported from 1688 for SHINEYOO product curation.`;

  const images = extractImages(cleanHtml);

  return {
    title: tidyText(title),
    images,
    price: pickPrice(cleanHtml),
    description: tidyText(description),
    source: sourceUrl,
  };
}

function pickMeta(html, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${escapedName}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+name=["']${escapedName}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escapedName}["']`, 'i'),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeEntities(match[1]);
  }

  return '';
}

function pickTitle(html) {
  const match = html.match(/<title[^>]*>(.*?)<\/title>/i);
  return match?.[1] ? decodeEntities(match[1]) : '';
}

function pickPrice(html) {
  const match =
    html.match(/["'](?:price|discountPrice|salePrice)["']\s*:\s*["']?([0-9]+(?:\.[0-9]+)?)/i) ||
    html.match(/￥\s*([0-9]+(?:\.[0-9]+)?)/);

  return match?.[1] ? `¥${match[1]}` : '';
}

function extractImages(html) {
  const candidates = new Set();
  const imagePatterns = [
    /https?:\/\/[^"'()<>\s]+?(?:alicdn|1688|alibaba)[^"'()<>\s]+?\.(?:jpg|jpeg|png|webp)/gi,
    /\/\/[^"'()<>\s]+?(?:alicdn|1688|alibaba)[^"'()<>\s]+?\.(?:jpg|jpeg|png|webp)/gi,
  ];

  for (const pattern of imagePatterns) {
    for (const match of html.matchAll(pattern)) {
      const image = cleanImageUrl(match[0]);
      if (isUsableImage(image)) candidates.add(image);
    }
  }

  return Array.from(candidates).slice(0, 12);
}

function cleanImageUrl(url) {
  let nextUrl = decodeEntities(url.trim());
  if (nextUrl.startsWith('//')) nextUrl = `https:${nextUrl}`;
  nextUrl = nextUrl.replace(/\\u002F/gi, '/');
  nextUrl = nextUrl.replace(/\\u003D/gi, '=');
  nextUrl = nextUrl.replace(/\\u0026/gi, '&');
  nextUrl = nextUrl.split('?')[0];
  nextUrl = nextUrl.replace(/_(?:\d+x\d+|sum|!!\d+x\d+).*$/i, '');
  return nextUrl;
}

function isUsableImage(url) {
  const lower = url.toLowerCase();
  if (!lower.startsWith('https://')) return false;
  if (lower.includes('logo') || lower.includes('icon') || lower.includes('avatar')) return false;
  if (lower.includes('60x60') || lower.includes('80x80') || lower.includes('100x100')) return false;
  return /\.(jpg|jpeg|png|webp)$/i.test(lower);
}

function decodeEntities(text) {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function tidyText(text) {
  return decodeEntities(String(text || ''))
    .replace(/\s+/g, ' ')
    .replace(/[-_ ]*1688.*$/i, '')
    .trim();
}

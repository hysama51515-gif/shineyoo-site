import { NextResponse } from 'next/server';
import { saveProducts } from '../../../lib/products';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function POST(request) {
  try {
    const { links } = await request.json();
    const sourceLinks = normalizeLinks(links);

    if (!sourceLinks.length) {
      return NextResponse.json({ error: 'Provide at least one valid 1688 product link.' }, { status: 400 });
    }

    const origin = new URL(request.url).origin;
    const imported = [];
    const failed = [];

    for (const link of sourceLinks) {
      try {
        const raw = await postJson(`${origin}/api/parse-1688`, { url: link });
        const enriched = await postJson(`${origin}/api/enrich-product`, raw);

        imported.push({
          ...enriched,
          images: enriched.images?.length ? enriched.images : raw.images || [],
          source_url: raw.source_url || link,
        });
      } catch (error) {
        failed.push({ link, error: error.message });
      }
    }

    const products = imported.length ? await saveProducts(imported) : [];

    return NextResponse.json({
      imported: products.length,
      failed,
      products,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Batch import failed.',
        detail: error.message,
      },
      { status: 500 },
    );
  }
}

function normalizeLinks(links) {
  const list = Array.isArray(links) ? links : String(links || '').split(/\s+/);

  return Array.from(
    new Set(
      list
        .map((link) => String(link || '').trim())
        .filter((link) => /^https?:\/\/.+1688\.com/i.test(link)),
    ),
  ).slice(0, 100);
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || data.detail || 'Request failed');
  return data;
}

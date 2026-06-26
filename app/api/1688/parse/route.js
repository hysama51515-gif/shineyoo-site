import { NextResponse } from 'next/server';
import { cleanImageList } from '../../../../lib/imageUtils';

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

    return NextResponse.json(cleanParsedProduct(data, url));
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

function cleanParsedProduct(data, fallbackUrl) {
  const mainImages = cleanImageList(data.main_images || [], 12);
  const skuImages = cleanImageList(data.sku_images || [], 20);
  const allImages = cleanImageList(
    [
      ...(data.images || []),
      ...(data.main_images || []),
      ...(data.detail_images || []),
      ...(data.sku_images || []),
      ...(data.all_images || []),
    ],
    80,
  );

  const mainSet = new Set(mainImages);
  const detailImages = cleanImageList(data.detail_images || [], 60).filter((image) => !mainSet.has(image));
  const mergedImages = cleanImageList([...mainImages, ...detailImages, ...skuImages, ...allImages], 60);

  return {
    ...data,
    title: data.title || 'Imported handbag',
    images: mergedImages,
    main_images: mainImages.length ? mainImages : mergedImages.slice(0, 8),
    detail_images: detailImages.length ? detailImages : mergedImages.slice(mainImages.length || 1, 40),
    sku_images: skuImages,
    all_images: allImages.length ? allImages : mergedImages,
    url: data.url || fallbackUrl,
  };
}

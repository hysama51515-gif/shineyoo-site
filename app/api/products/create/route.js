import { NextResponse } from 'next/server';
import { saveProduct } from '../../../../lib/products';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.title || !Array.isArray(body.images) || body.images.length === 0) {
      return NextResponse.json(
        { error: 'Product title and at least one selected image are required.' },
        { status: 400 },
      );
    }

    const product = await saveProduct({
      title: body.title,
      images: body.images,
      image: body.main_image || body.images[0],
      main_image: body.main_image || body.images[0],
      main_images: body.main_images || [],
      sku_images: body.sku_images || [],
      detail_images: body.detail_images || [],
      all_images: body.all_images || body.images,
      price: body.price || '',
      description: body.description || '',
      category: body.category || 'Bags',
      source_url: body.source_url || '',
    });

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          'Product could not be created. Local JSON writes work in development. On Vercel, configure GITHUB_TOKEN/GITHUB_REPO for persistent publishing.',
        detail: error.message,
      },
      { status: 500 },
    );
  }
}

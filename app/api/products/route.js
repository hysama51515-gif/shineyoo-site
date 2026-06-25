import { NextResponse } from 'next/server';
import { getProducts, saveProduct, saveProducts } from '../../../lib/products';

export const runtime = 'nodejs';

export async function GET() {
  const products = await getProducts();
  return NextResponse.json({ products });
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (Array.isArray(body.products)) {
      const products = await saveProducts(body.products);
      return NextResponse.json({ products });
    }

    if (!body.title || !body.images?.length) {
      return NextResponse.json(
        { error: 'Product title and at least one image are required.' },
        { status: 400 },
      );
    }

    const product = await saveProduct({
      title: body.title,
      images: body.images,
      price: body.price || '',
      description: body.description || '',
      category: body.category || 'Bags',
      source_url: body.source_url || body.source || '',
    });

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          'Product could not be saved. Local JSON writes work in development. On Vercel, add GITHUB_TOKEN/GITHUB_REPO env vars to publish JSON updates through GitHub.',
        detail: error.message,
      },
      { status: 500 },
    );
  }
}

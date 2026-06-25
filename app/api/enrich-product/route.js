import { NextResponse } from 'next/server';
import { enrichProduct } from '../../../lib/enrichProduct';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const rawProduct = await request.json();

    if (!rawProduct?.title && !rawProduct?.name) {
      return NextResponse.json({ error: 'Product title is required for enrichment.' }, { status: 400 });
    }

    const product = await enrichProduct(rawProduct);

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Product could not be enriched.',
        detail: error.message,
      },
      { status: 500 },
    );
  }
}

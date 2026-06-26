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
          '线上上架失败：Vercel 不能直接写入 data/products.json。请在 Vercel 环境变量配置 GITHUB_TOKEN 和 GITHUB_REPO 后重新部署，商品才能自动写回 GitHub 并显示在独立站。',
        detail: error.message,
        required_env: ['GITHUB_TOKEN', 'GITHUB_REPO'],
      },
      { status: 500 },
    );
  }
}

import fs from 'fs/promises';
import path from 'path';
import seedProducts from '../data/products.json';
import { cleanImageList } from './imageUtils';

const productsPath = path.join(process.cwd(), 'data', 'products.json');

export function normalizeProduct(product) {
  const cleanedImages = cleanImageList(product.images?.length ? product.images : product.image ? [product.image] : [], 80);
  const cleanedMainImages = cleanImageList(product.main_images?.length ? product.main_images : cleanedImages, 20);
  const cleanedDetailImages = cleanImageList(product.detail_images || [], 80);
  const cleanedSkuImages = cleanImageList(product.sku_images || [], 40);
  const cleanedAllImages = cleanImageList(product.all_images?.length ? product.all_images : cleanedImages, 100);
  const firstImage = cleanedImages[0] || product.image || '';
  const mainImage = cleanImageList([product.main_image, firstImage], 1)[0] || firstImage;

  return {
    id: product.id,
    title: product.title || product.name || 'Untitled product',
    name: product.title || product.name || 'Untitled product',
    images: cleanedImages.length ? cleanedImages : firstImage ? [firstImage] : [],
    image: firstImage,
    main_image: mainImage,
    main_images: cleanedMainImages.length ? cleanedMainImages : firstImage ? [firstImage] : [],
    detail_images: cleanedDetailImages,
    sku_images: cleanedSkuImages,
    all_images: cleanedAllImages.length ? cleanedAllImages : cleanedImages,
    price: product.price || '',
    description: product.description || '',
    category: product.category || 'Bags',
    source_url: product.source_url || product.source || '',
    created_at: product.created_at || new Date().toISOString(),
  };
}

export async function getProducts() {
  try {
    const file = await fs.readFile(productsPath, 'utf8');
    return JSON.parse(file).map(normalizeProduct);
  } catch {
    return seedProducts.map(normalizeProduct);
  }
}

export async function getProductById(id) {
  const products = await getProducts();
  return products.find((product) => product.id === id);
}

export async function saveProduct(product) {
  const products = await getProducts();
  const nextProduct = normalizeProduct({
    ...product,
    id: product.id || createProductId(product.title),
    created_at: product.created_at || new Date().toISOString(),
  });

  const existingIndex = products.findIndex((item) => item.id === nextProduct.id);
  const nextProducts =
    existingIndex >= 0
      ? products.map((item, index) => (index === existingIndex ? nextProduct : item))
      : [nextProduct, ...products];

  if (process.env.GITHUB_TOKEN) {
    await saveProductsToGithub(nextProducts);
    return nextProduct;
  }

  await fs.writeFile(productsPath, JSON.stringify(nextProducts, null, 2), 'utf8');
  return nextProduct;
}

export async function saveProducts(importedProducts) {
  const products = await getProducts();
  const normalizedProducts = importedProducts
    .filter((product) => product?.title && product?.images?.length)
    .map((product) =>
      normalizeProduct({
        ...product,
        id: product.id || createProductId(product.title),
        created_at: product.created_at || new Date().toISOString(),
      }),
    );

  const productMap = new Map(products.map((product) => [product.id, product]));

  for (const product of normalizedProducts) {
    productMap.set(product.id, product);
  }

  const importedIds = new Set(normalizedProducts.map((product) => product.id));
  const nextProducts = [
    ...normalizedProducts,
    ...products.filter((product) => !importedIds.has(product.id)),
  ].map((product) => productMap.get(product.id) || product);

  if (process.env.GITHUB_TOKEN) {
    await saveProductsToGithub(nextProducts, `Batch import ${normalizedProducts.length} ShineYOO products`);
    return normalizedProducts;
  }

  await fs.writeFile(productsPath, JSON.stringify(nextProducts, null, 2), 'utf8');
  return normalizedProducts;
}

export function createProductId(title = 'product') {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);

  return `${slug || 'product'}-${Date.now().toString(36)}`;
}

async function saveProductsToGithub(products, message = 'Publish product from ShineYOO admin') {
  const repo = process.env.GITHUB_REPO || 'hysama51515-gif/shineyoo-site';
  const branch = process.env.GITHUB_BRANCH || 'main';
  const filePath = 'data/products.json';
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;

  const current = await fetch(`${apiUrl}?ref=${branch}`, {
    headers: githubHeaders(),
    cache: 'no-store',
  });

  if (!current.ok) {
    throw new Error(`GitHub products.json lookup failed: ${current.status}`);
  }

  const currentFile = await current.json();
  const update = await fetch(apiUrl, {
    method: 'PUT',
    headers: githubHeaders(),
    body: JSON.stringify({
      message,
      branch,
      sha: currentFile.sha,
      content: Buffer.from(JSON.stringify(products, null, 2)).toString('base64'),
    }),
  });

  if (!update.ok) {
    const detail = await update.text();
    throw new Error(`GitHub products.json update failed: ${update.status} ${detail}`);
  }
}

function githubHeaders() {
  return {
    accept: 'application/vnd.github+json',
    authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    'content-type': 'application/json',
    'x-github-api-version': '2022-11-28',
  };
}

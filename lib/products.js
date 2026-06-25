import fs from 'fs/promises';
import path from 'path';
import seedProducts from '../data/products.json';

const productsPath = path.join(process.cwd(), 'data', 'products.json');

export function normalizeProduct(product) {
  const firstImage = product.images?.[0] || product.image || '';

  return {
    id: product.id,
    title: product.title || product.name || 'Untitled product',
    name: product.title || product.name || 'Untitled product',
    images: product.images?.length ? product.images : firstImage ? [firstImage] : [],
    image: firstImage,
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

export function createProductId(title = 'product') {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);

  return `${slug || 'product'}-${Date.now().toString(36)}`;
}

async function saveProductsToGithub(products) {
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
      message: 'Publish product from ShineYOO admin',
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

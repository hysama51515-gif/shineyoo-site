import { existsSync } from 'fs';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { NextResponse } from 'next/server';
import { cleanImageList } from '../../../lib/imageUtils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const localChromePaths = [
  process.env.CHROME_EXECUTABLE_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
].filter(Boolean);

export async function POST(request) {
  let browser;

  try {
    const { url } = await request.json();
    const sourceUrl = normalize1688Url(url);

    if (!sourceUrl) {
      return NextResponse.json({ error: 'Please paste a valid 1688 product URL.' }, { status: 400 });
    }

    browser = await launchBrowser();
    const page = await browser.newPage();

    await page.setViewport({ width: 1440, height: 1200, deviceScaleFactor: 1 });
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    );
    await page.setExtraHTTPHeaders({
      'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
      referer: 'https://www.1688.com/',
    });

    await page.goto(sourceUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 45000,
    });

    await dismissDialogs(page);
    await waitForProductDom(page);
    await autoScroll(page);

    const parsed = await page.evaluate(() => {
      const text = (value) => String(value || '').replace(/\s+/g, ' ').trim();
      const attr = (selector, attribute) =>
        document.querySelector(selector)?.getAttribute(attribute)?.trim() || '';

      const getMeta = (name) =>
        attr(`meta[property="${name}"]`, 'content') ||
        attr(`meta[name="${name}"]`, 'content') ||
        attr(`meta[itemprop="${name}"]`, 'content');

      const title =
        text(document.querySelector('[class*="title"], h1, .title-text')?.textContent) ||
        text(getMeta('og:title')) ||
        text(getMeta('twitter:title')) ||
        text(document.title);

      const description =
        text(getMeta('description')) ||
        text(getMeta('og:description')) ||
        text(
          document.querySelector(
            '[class*="description"], [class*="detail"], [class*="desc"], [class*="feature"]',
          )?.textContent,
        );

      const price =
        text(
          document.querySelector(
            '[class*="price"] [class*="value"], [class*="price"], [class*="Price"], [class*="offer-price"]',
          )?.textContent,
        ) ||
        text(document.body.innerText.match(/(?:¥|￥)\s*\d+(?:\.\d+)?/)?.[0]);

      const imageNodes = Array.from(
        document.querySelectorAll(
          [
            '[class*="main"] img',
            '[class*="gallery"] img',
            '[class*="thumb"] img',
            '[class*="image"] img',
            '[class*="detail"] img',
            'img',
          ].join(','),
        ),
      );

      const imageAttributes = ['src', 'data-src', 'data-lazy-src', 'data-original', 'data-img', 'data-url'];
      const images = [];

      for (const image of imageNodes) {
        for (const key of imageAttributes) {
          const value = image.getAttribute(key);
          if (value) images.push(value);
        }

        const srcset = image.getAttribute('srcset') || image.getAttribute('data-srcset');
        if (srcset) {
          srcset.split(',').forEach((item) => images.push(item.trim().split(/\s+/)[0]));
        }
      }

      const scriptText = Array.from(document.scripts)
        .map((script) => script.textContent || '')
        .join('\n');

      const scriptImages = scriptText.match(/(?:https?:)?\/\/[^"'\\\s<>]+?(?:alicdn|1688|alibaba)[^"'\\\s<>]+?\.(?:jpg|jpeg|png|webp)/gi) || [];
      images.push(...scriptImages);

      const skuInfo = Array.from(
        document.querySelectorAll('[class*="sku"] li, [class*="sku"] button, [class*="prop"] li, [class*="spec"] li'),
      )
        .map((node) => text(node.textContent))
        .filter(Boolean)
        .slice(0, 40);

      return {
        title,
        images,
        price,
        description,
        sku_info: Array.from(new Set(skuInfo)),
        html: document.documentElement.innerHTML,
      };
    });

    const fallback = parseHtmlFallback(parsed.html);
    const images = cleanImageList(uniqueImages([...(parsed.images || []), ...fallback.images]), 30);
    const title = tidyText(parsed.title || fallback.title || 'Imported 1688 Product');

    if (!title && images.length === 0) {
      return NextResponse.json(
        {
          error:
            '1688 did not expose product data to the browser session. The page may require login, captcha, or region verification.',
          source_url: sourceUrl,
        },
        { status: 422 },
      );
    }

    return NextResponse.json({
      title,
      images,
      price: normalizePrice(parsed.price || fallback.price),
      description:
        tidyText(parsed.description || fallback.description) ||
        `${title} — imported from 1688 for SHINEYOO product curation.`,
      sku_info: parsed.sku_info || [],
      source_url: sourceUrl,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          'Unable to parse this 1688 page with headless browser. It may require login, captcha, or block automated access.',
        detail: error.message,
      },
      { status: 500 },
    );
  } finally {
    if (browser) await browser.close();
  }
}

async function launchBrowser() {
  const executablePath = getLocalChromePath() || (await chromium.executablePath());

  return puppeteer.launch({
    args: [
      ...chromium.args,
      '--disable-blink-features=AutomationControlled',
      '--disable-features=IsolateOrigins,site-per-process',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1440,1200',
    ],
    defaultViewport: { width: 1440, height: 1200 },
    executablePath,
    headless: true,
  });
}

function getLocalChromePath() {
  return localChromePaths.find((chromePath) => existsSync(chromePath));
}

function normalize1688Url(url) {
  if (!url || typeof url !== 'string') return '';

  try {
    const parsed = new URL(url.trim());
    if (!/(^|\.)1688\.com$/i.test(parsed.hostname)) return '';
    return parsed.toString();
  } catch {
    return '';
  }
}

async function dismissDialogs(page) {
  await page.evaluate(() => {
    const selectors = [
      '[class*="close"]',
      '[class*="Close"]',
      '[aria-label*="close" i]',
      '[aria-label*="关闭"]',
      '.next-dialog-close',
    ];

    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        if (element instanceof HTMLElement) element.click();
      });
    });
  });
}

async function waitForProductDom(page) {
  try {
    await page.waitForFunction(
      () => {
        const bodyText = document.body?.innerText || '';
        const imageCount = document.querySelectorAll('img').length;
        return imageCount >= 3 || /价格|￥|¥|规格|商品|采购|起批/.test(bodyText);
      },
      { timeout: 20000 },
    );
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 600;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= Math.min(document.body.scrollHeight, 5000)) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 180);
    });
  });
}

function parseHtmlFallback(html = '') {
  const cleanHtml = html.replace(/\\\//g, '/').replace(/&amp;/g, '&');

  return {
    title: pickMeta(cleanHtml, 'og:title') || pickMeta(cleanHtml, 'twitter:title') || pickTitle(cleanHtml),
    description: pickMeta(cleanHtml, 'description') || pickMeta(cleanHtml, 'og:description'),
    price: pickPrice(cleanHtml),
    images: extractImages(cleanHtml),
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
    html.match(/["'](?:price|discountPrice|salePrice|offerPrice)["']\s*:\s*["']?([0-9]+(?:\.[0-9]+)?)/i) ||
    html.match(/(?:¥|￥)\s*([0-9]+(?:\.[0-9]+)?)/);

  return match?.[1] ? `¥${match[1]}` : '';
}

function extractImages(html) {
  const candidates = [];
  const imagePatterns = [
    /https?:\/\/[^"'()<>\s\\]+?(?:alicdn|1688|alibaba)[^"'()<>\s\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /\/\/[^"'()<>\s\\]+?(?:alicdn|1688|alibaba)[^"'()<>\s\\]+?\.(?:jpg|jpeg|png|webp)/gi,
  ];

  for (const pattern of imagePatterns) {
    for (const match of html.matchAll(pattern)) {
      candidates.push(match[0]);
    }
  }

  return uniqueImages(candidates);
}

function uniqueImages(images) {
  const seen = new Set();
  const result = [];

  for (const candidate of images) {
    const image = cleanImageUrl(candidate);
    if (!isUsableImage(image) || seen.has(image)) continue;
    seen.add(image);
    result.push(image);
  }

  return result.sort((a, b) => imageScore(b) - imageScore(a));
}

function cleanImageUrl(url) {
  let nextUrl = decodeEntities(String(url || '').trim());
  if (!nextUrl) return '';

  nextUrl = nextUrl.replace(/^https?:https?:/i, 'https:');
  if (nextUrl.startsWith('//')) nextUrl = `https:${nextUrl}`;
  nextUrl = nextUrl.replace(/\\u002F/gi, '/');
  nextUrl = nextUrl.replace(/\\u003D/gi, '=');
  nextUrl = nextUrl.replace(/\\u0026/gi, '&');
  nextUrl = nextUrl.replace(/\\/g, '');
  nextUrl = nextUrl.split('?')[0];
  nextUrl = nextUrl.replace(/_(?:\d+x\d+|sum|!!\d+x\d+).*$/i, '');

  return nextUrl;
}

function isUsableImage(url) {
  const lower = url.toLowerCase();
  if (!lower.startsWith('https://')) return false;
  if (!/(alicdn|1688|alibaba)/.test(lower)) return false;
  if (lower.includes('logo') || lower.includes('icon') || lower.includes('avatar')) return false;
  if (lower.includes('sprite') || lower.includes('loading') || lower.includes('transparent')) return false;
  if (/(?:30x30|40x40|50x50|60x60|80x80|100x100)/.test(lower)) return false;
  return /\.(jpg|jpeg|png|webp)$/i.test(lower);
}

function imageScore(url) {
  const lower = url.toLowerCase();
  let score = 0;
  if (lower.includes('img.alicdn.com')) score += 4;
  if (lower.includes('/bao/uploaded/')) score += 3;
  if (lower.includes('jpg')) score += 1;
  if (lower.includes('!!')) score -= 2;
  if (lower.includes('thumb')) score -= 2;
  return score;
}

function normalizePrice(price) {
  const cleaned = tidyText(price);
  const match = cleaned.match(/(?:¥|￥)?\s*([0-9]+(?:\.[0-9]+)?)/);
  return match ? `¥${match[1]}` : cleaned;
}

function decodeEntities(text) {
  return String(text || '')
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

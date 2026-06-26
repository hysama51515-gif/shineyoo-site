const IMAGE_HOST_PATTERN = /(alicdn|1688|alibaba|tbcdn|alicdn-inc)/i;
const PRODUCT_IMAGE_HINTS = /(alicdn|imgextra|cbu01|cbu02|cbu03|cbu04|cbu05|cbu06|cbu07|cbu08|cbu09|cbu10|gw\.alicdn|img\.alicdn|tbcdn)/i;
const BAD_IMAGE_HINTS =
  /(icon|logo|sprite|avatar|loading|blank|transparent|placeholder|grey|gray|gif|button|qrcode|qr_code|wangwang|taobao_space|pixel|beacon|trace|collect|download|plugin|official|1688app|appdownload)/i;

export const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1200" viewBox="0 0 1000 1200"><rect width="1000" height="1200" fill="%23eee9df"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23766f65" font-family="Arial, Helvetica, sans-serif" font-size="34" letter-spacing="8">SHINEYOO</text></svg>';

export function normalizeImageUrl(value = '') {
  if (!value || typeof value !== 'string') return '';

  let url = value.trim().replace(/&amp;/g, '&');
  if (!url || url.startsWith('data:') || url.startsWith('blob:')) return '';
  if (url.startsWith('//')) url = `https:${url}`;
  if (url.startsWith('http://')) url = url.replace('http://', 'https://');

  try {
    const parsed = new URL(url);
    parsed.hash = '';

    const pathname = parsed.pathname
      .replace(/_(?:\d+x\d+|sum|!!\d+x\d+|\.webp).*$/i, '')
      .replace(/\.webp$/i, '.jpg');

    parsed.pathname = pathname;
    return parsed.toString();
  } catch {
    return '';
  }
}

export function isLikelyProductImage(value = '') {
  const url = normalizeImageUrl(value);
  if (!url) return false;

  const lower = url.toLowerCase();
  if (!IMAGE_HOST_PATTERN.test(lower)) return false;
  if (!PRODUCT_IMAGE_HINTS.test(lower)) return false;
  if (BAD_IMAGE_HINTS.test(lower)) return false;
  if (!/\.(jpg|jpeg|png|webp)(\?|$)/i.test(lower)) return false;
  if (/(?:^|[^\d])(?:1[0-9]|2[0-9]|3[0-9]|40|50|60|70|80)x(?:1[0-9]|2[0-9]|3[0-9]|40|50|60|70|80)(?:[^\d]|$)/i.test(lower)) {
    return false;
  }

  return true;
}

export function cleanImageList(images = [], limit = 60) {
  const seen = new Set();
  const cleaned = [];

  for (const image of images || []) {
    const url = normalizeImageUrl(image);
    if (!url || !isLikelyProductImage(url) || seen.has(url)) continue;
    seen.add(url);
    cleaned.push(url);
    if (cleaned.length >= limit) break;
  }

  return cleaned;
}

export function shouldProxyImage(value = '') {
  const url = normalizeImageUrl(value);
  return Boolean(url && IMAGE_HOST_PATTERN.test(url));
}

export function getDisplayImageUrl(value = '') {
  const url = normalizeImageUrl(value);
  if (!url) return '';
  if (!shouldProxyImage(url)) return url;
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}

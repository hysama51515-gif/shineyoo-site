const categories = ['Bags', 'New', 'Evening', 'Accessories'];

const factoryWords =
  /1688|阿里巴巴|批发|厂家|工厂|源头|一件代发|跨境|外贸|现货|包邮|网红|爆款|地摊|低价|便宜|代发|货源|供应商|新款|女包|女士|真皮|pu|pvc|大容量|高级感/gi;

const titlePatterns = [
  'Soft Structured {material} Tote with Minimalist Silhouette',
  'Sculptural {material} Shoulder Bag for Everyday Elegance',
  'Compact {material} Top Handle Bag with Quiet Proportions',
  'Polished {material} Crossbody Bag with Architectural Lines',
  'Evening {material} Clutch with Refined Modern Finish',
  'Lightweight {material} Carryall with Clean Editorial Shape',
];

const materialWords = [
  { test: /皮|leather|真皮/i, value: 'Leather' },
  { test: /帆布|canvas/i, value: 'Canvas' },
  { test: /绒|suede/i, value: 'Suede' },
  { test: /编织|woven|weave/i, value: 'Woven' },
  { test: /尼龙|nylon/i, value: 'Nylon' },
];

export async function enrichProduct(rawProduct) {
  if (process.env.OPENAI_API_KEY) {
    try {
      return await enrichWithOpenAI(rawProduct);
    } catch {
      return enrichLocally(rawProduct);
    }
  }

  return enrichLocally(rawProduct);
}

export function enrichLocally(rawProduct = {}) {
  const rawTitle = tidy(rawProduct.title || rawProduct.name || 'Minimal handbag');
  const material = detectMaterial(rawTitle);
  const category = detectCategory(rawTitle, rawProduct.category);
  const title = buildLuxuryTitle(rawTitle, material, category);
  const price = normalizeNumericPrice(rawProduct.price);

  return {
    title,
    description: buildEditorialDescription(title, rawTitle, category),
    category,
    images: Array.isArray(rawProduct.images) ? rawProduct.images.filter(Boolean).slice(0, 12) : [],
    price,
    source_url: rawProduct.source_url || rawProduct.source || '',
    sku_info: rawProduct.sku_info || [],
  };
}

async function enrichWithOpenAI(rawProduct) {
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      input: [
        {
          role: 'system',
          content:
            'You transform raw 1688 handbag listings into luxury fashion ecommerce copy for SHINEYOO. Remove factory, wholesale, 1688, cheap, supplier, dropshipping language. Output strict JSON only.',
        },
        {
          role: 'user',
          content: JSON.stringify({
            required_schema: {
              title: 'Luxury-style English product name',
              description: 'Editorial fashion description, 1-2 refined sentences',
              category: 'One of Bags, New, Evening, Accessories',
              images: 'same image array, unchanged',
              price: 'number if available',
            },
            raw_product: rawProduct,
          }),
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'luxury_product',
          schema: {
            type: 'object',
            additionalProperties: false,
            required: ['title', 'description', 'category', 'images', 'price'],
            properties: {
              title: { type: 'string' },
              description: { type: 'string' },
              category: { type: 'string', enum: categories },
              images: { type: 'array', items: { type: 'string' } },
              price: { type: ['number', 'string'] },
            },
          },
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI enrichment failed: ${response.status}`);
  }

  const data = await response.json();
  const content = data.output_text || data.output?.[0]?.content?.[0]?.text || '{}';
  const parsed = JSON.parse(content);

  return {
    title: tidy(parsed.title),
    description: tidy(parsed.description),
    category: categories.includes(parsed.category) ? parsed.category : detectCategory(parsed.title),
    images: Array.isArray(parsed.images) ? parsed.images.filter(Boolean).slice(0, 12) : rawProduct.images || [],
    price: normalizeNumericPrice(parsed.price || rawProduct.price),
    source_url: rawProduct.source_url || rawProduct.source || '',
    sku_info: rawProduct.sku_info || [],
  };
}

function buildLuxuryTitle(rawTitle, material, category) {
  const cleaned = tidy(rawTitle)
    .replace(factoryWords, '')
    .replace(/[【】\[\]（）()]/g, ' ')
    .replace(/\d+(?:\.\d+)?\s*元/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (/clutch|晚宴|宴会|手拿/i.test(rawTitle)) {
    return `Evening ${material} Clutch with Refined Modern Finish`;
  }

  if (/tote|托特|通勤|大包|购物/i.test(rawTitle)) {
    return `Soft Structured ${material} Tote with Minimalist Silhouette`;
  }

  if (/肩|腋下|shoulder/i.test(rawTitle)) {
    return `Sculptural ${material} Shoulder Bag for Everyday Elegance`;
  }

  if (/斜挎|crossbody|链条/i.test(rawTitle)) {
    return `Polished ${material} Crossbody Bag with Architectural Lines`;
  }

  if (category === 'Accessories') {
    return `Compact ${material} Accessory Pouch with Quiet Proportions`;
  }

  const index = Math.abs(hashCode(cleaned || rawTitle)) % titlePatterns.length;
  return titlePatterns[index].replace('{material}', material);
}

function buildEditorialDescription(title, rawTitle, category) {
  const mood = category === 'Evening' ? 'evening edits' : 'daily styling';
  const detail = /链|chain/i.test(rawTitle)
    ? 'A subtle chain detail adds light-catching structure without overpowering the silhouette.'
    : 'Its pared-back shape keeps the focus on proportion, texture, and quiet confidence.';

  return `${title} is curated for modern women who prefer refined essentials over visible excess. ${detail} Designed for ${mood}, it brings a composed SHINEYOO finish to the wardrobe.`;
}

function detectCategory(title = '', fallback = 'Bags') {
  if (categories.includes(fallback)) return fallback;
  if (/晚宴|宴会|手拿|clutch|evening/i.test(title)) return 'Evening';
  if (/钱包|挂件|卡包|accessor|pouch/i.test(title)) return 'Accessories';
  if (/新|new|2026/i.test(title)) return 'New';
  return 'Bags';
}

function detectMaterial(title = '') {
  return materialWords.find((material) => material.test.test(title))?.value || 'Leather';
}

function normalizeNumericPrice(price) {
  const match = String(price || '').match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : '';
}

function tidy(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function hashCode(value) {
  return value.split('').reduce((hash, char) => (hash << 5) - hash + char.charCodeAt(0), 0);
}

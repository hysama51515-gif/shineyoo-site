'use client';

import { useMemo, useState } from 'react';

const samplePlaceholder = `https://detail.1688.com/offer/xxxxxxxx.html
https://detail.1688.com/offer/yyyyyyyy.html`;

export default function BatchImportClient() {
  const [linksText, setLinksText] = useState('');
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('Ready to import.');
  const [isImporting, setIsImporting] = useState(false);

  const links = useMemo(
    () =>
      Array.from(
        new Set(
          linksText
            .split(/\s+/)
            .map((link) => link.trim())
            .filter((link) => /^https?:\/\/.+1688\.com/i.test(link)),
        ),
      ).slice(0, 100),
    [linksText],
  );

  async function startImport() {
    if (!links.length) {
      setStatus('Paste at least one valid 1688 product link.');
      return;
    }

    setIsImporting(true);
    setItems([]);
    setStatus(`Importing ${links.length} links. Keep this page open.`);

    const imported = [];
    const log = [];

    for (let index = 0; index < links.length; index += 1) {
      const link = links[index];
      const rowId = `${index}-${Date.now()}`;
      const baseRow = {
        id: rowId,
        link,
        status: 'Parsing 1688 page',
        title: '',
        images: 0,
        error: '',
      };

      setItems((current) => [...current, baseRow]);

      try {
        const raw = await postJson('/api/parse-1688', { url: link });
        updateRow(rowId, {
          status: 'Creating luxury copy',
          title: raw.title || 'Untitled supplier item',
          images: raw.images?.length || 0,
        });

        const enriched = await postJson('/api/enrich-product', raw);
        imported.push({
          ...enriched,
          images: enriched.images?.length ? enriched.images : raw.images || [],
          source_url: raw.source_url || link,
        });

        updateRow(rowId, {
          status: 'Ready to save',
          title: enriched.title,
          images: enriched.images?.length || raw.images?.length || 0,
        });
      } catch (error) {
        log.push({ link, error: error.message });
        updateRow(rowId, {
          status: 'Failed',
          error: error.message,
        });
      }

      setStatus(`Processed ${index + 1}/${links.length}. Successful: ${imported.length}.`);
    }

    if (imported.length) {
      setStatus(`Saving ${imported.length} enriched products to JSON...`);
      const saved = await postJson('/api/products', { products: imported });
      setStatus(`Saved ${saved.products?.length || imported.length} products. Failed: ${log.length}.`);
    } else {
      setStatus(`No products saved. Failed: ${log.length}.`);
    }

    setIsImporting(false);
  }

  function updateRow(id, patch) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  return (
    <div className="mt-16 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="bg-white p-5 shadow-[0_24px_90px_rgba(42,34,20,0.06)] md:p-8">
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[.28em] text-stone-500">Batch links</p>
            <h2 className="mt-3 text-3xl tracking-[-.045em]">Paste 1688 URLs</h2>
          </div>
          <span className="text-xs text-stone-500">{links.length}/100 valid</span>
        </div>

        <textarea
          value={linksText}
          onChange={(event) => setLinksText(event.target.value)}
          placeholder={samplePlaceholder}
          rows={15}
          className="mt-8 w-full resize-none bg-[#fbf8f2] p-5 font-mono text-xs leading-6 text-stone-700 outline-none ring-1 ring-stone-200 transition focus:ring-stone-950"
        />

        <button
          type="button"
          onClick={startImport}
          disabled={isImporting || !links.length}
          className="mt-6 w-full rounded-full bg-stone-950 px-8 py-4 text-[11px] uppercase tracking-[.2em] text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-45"
        >
          {isImporting ? 'Importing...' : 'Start batch import'}
        </button>

        <p className="mt-5 text-sm leading-6 text-stone-600">{status}</p>
      </section>

      <section className="bg-[#fbf8f2] p-5 md:p-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[.28em] text-stone-500">Import queue</p>
            <h2 className="mt-3 text-3xl tracking-[-.045em]">Enrichment progress</h2>
          </div>
          <p className="text-xs uppercase tracking-[.18em] text-stone-400">AI editorial layer</p>
        </div>

        <div className="mt-8 space-y-3">
          {items.length === 0 && (
            <div className="border border-dashed border-stone-300 p-8 text-sm leading-7 text-stone-500">
              Imported products will appear here with parsing status, generated luxury title, and image count.
            </div>
          )}

          {items.map((item, index) => (
            <div key={item.id} className="bg-white p-4 shadow-[0_12px_40px_rgba(40,34,25,0.04)]">
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[.18em] text-stone-400">#{index + 1}</p>
                  <h3 className="mt-2 truncate text-sm uppercase tracking-[.1em] text-stone-950">
                    {item.title || 'Waiting for product data'}
                  </h3>
                  <p className="mt-2 truncate text-xs text-stone-400">{item.link}</p>
                  {item.error && <p className="mt-2 text-xs leading-5 text-red-600">{item.error}</p>}
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-stone-600">{item.status}</p>
                  <p className="mt-2 text-[10px] uppercase tracking-[.16em] text-stone-400">
                    {item.images} images
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || data.detail || 'Request failed');
  return data;
}

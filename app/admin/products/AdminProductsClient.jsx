'use client';

import { useState } from 'react';

const categories = ['Bags', 'New', 'Evening', 'Accessories'];

export default function AdminProductsClient({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
  const [sourceUrl, setSourceUrl] = useState('');
  const [form, setForm] = useState({
    title: '',
    images: [],
    price: '',
    description: '',
    category: 'Bags',
    source_url: '',
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  async function parseFrom1688() {
    setLoading(true);
    setStatus('Parsing 1688 page...');

    try {
      const response = await fetch('/api/parse-1688', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: sourceUrl }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Parse failed');

      setForm({
        title: data.title || '',
        images: data.images || [],
        price: data.price || '',
        description: data.description || '',
        category: 'Bags',
        source_url: data.source || sourceUrl,
      });
      setStatus(`Parsed ${data.images?.length || 0} images. Review before publishing.`);
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveProduct(event) {
    event.preventDefault();
    setLoading(true);
    setStatus('Saving product...');

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Save failed');

      setProducts([data.product, ...products]);
      setStatus('Product published to JSON.');
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  }

  function updateImage(index, value) {
    const images = [...form.images];
    images[index] = value;
    setForm({ ...form, images: images.filter(Boolean) });
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-[2rem] bg-white p-5 shadow-[0_24px_80px_rgba(40,34,25,0.06)] md:p-8">
        <p className="text-[10px] uppercase tracking-[.32em] text-stone-500">1688 importer</p>
        <h2 className="mt-4 text-3xl tracking-[-.04em] text-stone-950">Import product</h2>

        <div className="mt-8 flex gap-3">
          <input
            value={sourceUrl}
            onChange={(event) => setSourceUrl(event.target.value)}
            placeholder="Paste 1688 product URL"
            className="min-w-0 flex-1 rounded-full border border-stone-200 bg-[#fdfbf7] px-5 py-3 text-sm outline-none transition focus:border-stone-950"
          />
          <button
            type="button"
            onClick={parseFrom1688}
            disabled={loading}
            className="rounded-full bg-stone-950 px-6 py-3 text-[11px] uppercase tracking-[.16em] text-white disabled:opacity-45"
          >
            Parse
          </button>
        </div>

        {status && <p className="mt-4 text-sm leading-6 text-stone-600">{status}</p>}

        <form onSubmit={saveProduct} className="mt-8 space-y-5">
          <label className="block">
            <span className="text-[10px] uppercase tracking-[.22em] text-stone-500">Title</span>
            <input
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              className="mt-2 w-full border-b border-stone-200 bg-transparent py-3 text-sm outline-none focus:border-stone-950"
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="text-[10px] uppercase tracking-[.22em] text-stone-500">Category</span>
              <select
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value })}
                className="mt-2 w-full border-b border-stone-200 bg-transparent py-3 text-sm outline-none focus:border-stone-950"
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-[10px] uppercase tracking-[.22em] text-stone-500">Price optional</span>
              <input
                value={form.price}
                onChange={(event) => setForm({ ...form, price: event.target.value })}
                className="mt-2 w-full border-b border-stone-200 bg-transparent py-3 text-sm outline-none focus:border-stone-950"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-[10px] uppercase tracking-[.22em] text-stone-500">Description</span>
            <textarea
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              rows={5}
              className="mt-2 w-full resize-none border border-stone-200 bg-[#fdfbf7] p-4 text-sm leading-6 outline-none focus:border-stone-950"
            />
          </label>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[.22em] text-stone-500">Images</span>
              <button
                type="button"
                onClick={() => setForm({ ...form, images: [...form.images, ''] })}
                className="text-[10px] uppercase tracking-[.16em] text-stone-950"
              >
                Add image
              </button>
            </div>
            <div className="mt-3 space-y-2">
              {form.images.map((image, index) => (
                <input
                  key={`${image}-${index}`}
                  value={image}
                  onChange={(event) => updateImage(index, event.target.value)}
                  className="w-full border-b border-stone-200 bg-transparent py-2 text-xs outline-none focus:border-stone-950"
                />
              ))}
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full rounded-full bg-stone-950 px-6 py-4 text-[11px] uppercase tracking-[.2em] text-white disabled:opacity-45"
          >
            Publish product
          </button>
        </form>
      </section>

      <section>
        <p className="text-[10px] uppercase tracking-[.32em] text-stone-500">Preview</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {form.images.slice(0, 4).map((image, index) => (
            <div key={`${image}-${index}`} className="aspect-square overflow-hidden bg-stone-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>

        <div className="mt-12">
          <p className="text-[10px] uppercase tracking-[.32em] text-stone-500">Current products</p>
          <div className="mt-5 space-y-3">
            {products.map((product) => (
              <div key={product.id} className="flex items-center justify-between border-b border-stone-200 pb-3 text-sm">
                <span>{product.title}</span>
                <span className="text-stone-400">{product.category}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

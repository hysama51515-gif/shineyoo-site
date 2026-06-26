'use client';

import { useMemo, useState } from 'react';

const groups = [
  ['main_images', 'Main images'],
  ['detail_images', 'Detail images'],
  ['sku_images', 'SKU images'],
  ['all_images', 'All images'],
];

export default function AdminPanelClient({ initialProducts }) {
  const [sourceUrl, setSourceUrl] = useState('');
  const [status, setStatus] = useState('Ready.');
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState(null);
  const [title, setTitle] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);
  const [products, setProducts] = useState(initialProducts || []);

  const selectedSet = useMemo(() => new Set(selectedImages), [selectedImages]);
  const mainImage = selectedImages[0] || '';

  async function fetchProduct() {
    if (!sourceUrl.trim()) {
      setStatus('Please paste a 1688 product link first.');
      return;
    }

    setLoading(true);
    setStatus('Calling VPS parser and rendering 1688 page...');

    try {
      const response = await fetch('/api/1688/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: sourceUrl.trim() }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || '1688 parsing failed.');

      const initialImages = dedupe([
        ...(data.main_images || []),
        ...(data.detail_images || []),
        ...(data.sku_images || []),
      ]).slice(0, 30);

      setProductData(data);
      setTitle(data.title || '');
      setSelectedImages(initialImages);
      setStatus(
        `Fetched ${data.all_images?.length || data.images?.length || 0} images. Selected ${initialImages.length}.`,
      );
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  }

  function toggleImage(image) {
    setSelectedImages((current) =>
      current.includes(image) ? current.filter((item) => item !== image) : [...current, image],
    );
  }

  function removeSelected(image) {
    setSelectedImages((current) => current.filter((item) => item !== image));
  }

  function moveSelected(from, to) {
    if (from === null || to === null || from === to) return;
    setSelectedImages((current) => {
      const next = [...current];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }

  async function publishProduct() {
    if (!title.trim() || selectedImages.length === 0 || !productData) {
      setStatus('Title and at least one selected image are required.');
      return;
    }

    setLoading(true);
    setStatus('Publishing product to catalogue...');

    try {
      const response = await fetch('/api/products/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          images: selectedImages,
          main_image: mainImage,
          main_images: productData.main_images || [],
          sku_images: productData.sku_images || [],
          detail_images: productData.detail_images || [],
          all_images: productData.all_images || productData.images || [],
          source_url: productData.url || sourceUrl,
        }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Publish failed.');

      setProducts((current) => [data.product, ...current.filter((item) => item.id !== data.product.id)]);
      setStatus(`Published: ${data.product.title}`);
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 py-10 xl:grid-cols-[0.86fr_1.14fr]">
      <section className="space-y-6">
        <div className="bg-white p-5 shadow-[0_24px_90px_rgba(42,34,20,0.06)] md:p-8">
          <p className="text-[10px] uppercase tracking-[.28em] text-stone-500">1688 link</p>
          <div className="mt-5 flex flex-col gap-3 md:flex-row">
            <input
              value={sourceUrl}
              onChange={(event) => setSourceUrl(event.target.value)}
              placeholder="Paste 1688 product URL"
              className="min-w-0 flex-1 rounded-full border border-stone-200 bg-[#fbf8f2] px-5 py-3 text-sm outline-none transition focus:border-stone-950"
            />
            <button
              type="button"
              onClick={fetchProduct}
              disabled={loading}
              className="rounded-full bg-stone-950 px-7 py-3 text-[11px] uppercase tracking-[.18em] text-white transition hover:bg-stone-800 disabled:opacity-45"
            >
              抓取商品
            </button>
          </div>
          <p className="mt-4 text-sm leading-6 text-stone-600">{status}</p>
        </div>

        <div className="bg-white p-5 md:p-8">
          <p className="text-[10px] uppercase tracking-[.28em] text-stone-500">Product editor</p>
          <label className="mt-6 block">
            <span className="text-[10px] uppercase tracking-[.22em] text-stone-500">Title</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-2 w-full border-b border-stone-200 bg-transparent py-3 text-sm outline-none focus:border-stone-950"
            />
          </label>

          <div className="mt-8">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[10px] uppercase tracking-[.22em] text-stone-500">
                Selected images / drag to sort
              </p>
              <span className="text-xs text-stone-500">{selectedImages.length} selected</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
              {selectedImages.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  draggable
                  onDragStart={() => setDragIndex(index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => {
                    moveSelected(dragIndex, index);
                    setDragIndex(null);
                  }}
                  className={`group relative aspect-square cursor-move overflow-hidden bg-stone-100 ring-1 ${
                    index === 0 ? 'ring-stone-950' : 'ring-stone-200'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeSelected(image)}
                    className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-xs text-stone-950 opacity-90 shadow"
                  >
                    ×
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 bg-stone-950 px-2 py-1 text-[9px] uppercase tracking-[.12em] text-white">
                      Main
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={publishProduct}
            disabled={loading || !productData}
            className="mt-8 w-full rounded-full bg-stone-950 px-8 py-4 text-[11px] uppercase tracking-[.2em] text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-45"
          >
            确认上架
          </button>
        </div>

        <div className="bg-[#fbf8f2] p-5 md:p-8">
          <p className="text-[10px] uppercase tracking-[.28em] text-stone-500">Product library</p>
          <div className="mt-5 space-y-3">
            {products.slice(0, 8).map((product) => (
              <div key={product.id} className="flex items-center gap-4 border-b border-stone-200 pb-3">
                <div className="h-14 w-14 overflow-hidden bg-stone-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.image || product.images?.[0]} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-stone-950">{product.title}</p>
                  <p className="text-xs text-stone-500">{product.images?.length || 0} images</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-8">
        {!productData && (
          <div className="min-h-[420px] bg-[#fbf8f2] p-8 text-sm leading-7 text-stone-500">
            Product images will appear here after the VPS parser returns data. Select images from each group, then
            reorder the selected list on the left before publishing.
          </div>
        )}

        {productData &&
          groups.map(([key, label]) => (
            <ImageGroup
              key={key}
              label={label}
              images={productData[key] || []}
              selectedSet={selectedSet}
              onToggle={toggleImage}
            />
          ))}
      </section>
    </div>
  );
}

function ImageGroup({ label, images, selectedSet, onToggle }) {
  const visibleImages = dedupe(images).slice(0, 60);

  return (
    <div className="bg-[#fbf8f2] p-5 md:p-8">
      <div className="flex items-center justify-between gap-6">
        <p className="text-[10px] uppercase tracking-[.28em] text-stone-500">{label}</p>
        <span className="text-xs text-stone-500">{visibleImages.length} images</span>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        {visibleImages.map((image) => {
          const selected = selectedSet.has(image);
          return (
            <button
              type="button"
              key={image}
              onClick={() => onToggle(image)}
              className={`group relative aspect-square overflow-hidden bg-stone-100 text-left ring-1 transition ${
                selected ? 'ring-2 ring-stone-950' : 'ring-stone-200 hover:ring-stone-500'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
              <span
                className={`absolute left-2 top-2 grid h-6 w-6 place-items-center rounded-full text-[10px] ${
                  selected ? 'bg-stone-950 text-white' : 'bg-white/90 text-stone-500'
                }`}
              >
                {selected ? '✓' : '+'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function dedupe(images) {
  return Array.from(new Set((images || []).filter(Boolean)));
}

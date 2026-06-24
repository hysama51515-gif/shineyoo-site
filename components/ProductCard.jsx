import Image from 'next/image';

export default function ProductCard({ product }) {
  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden bg-cream">
        <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="image-zoom object-cover" />
        {product.note && <span className="absolute left-3 top-3 bg-[#fdfcf9] px-2.5 py-1 text-[9px] uppercase tracking-[.15em]">{product.note}</span>}
      </div>
      <div className="flex justify-between gap-3 pt-4"><div><h3 className="text-sm font-medium">{product.name}</h3><p className="mt-1 text-xs text-black/50">{product.description}</p></div><span className="text-sm">{product.price}</span></div>
    </article>
  );
}

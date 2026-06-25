import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product }) {
  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-[#e8ded0] shadow-[0_22px_70px_rgba(50,39,28,0.10)]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="image-zoom object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/28 via-black/0 to-white/10 opacity-80" />
        {product.note && (
          <span className="absolute left-4 top-4 rounded-full border border-white/50 bg-white/55 px-3 py-1 text-[10px] uppercase tracking-[.18em] text-stone-950 backdrop-blur-md">
            {product.note}
          </span>
        )}
      </div>

      <div className="flex items-start justify-between gap-5 pt-5">
        <div>
          <h3 className="text-base font-medium tracking-[-.02em] text-stone-950">{product.name}</h3>
          <p className="mt-2 max-w-xs text-sm leading-6 text-stone-600">{product.description}</p>
        </div>
        <Link
          href="/products"
          className="shrink-0 rounded-full border border-stone-950/15 px-4 py-2 text-sm text-stone-950 transition hover:-translate-y-0.5 hover:border-stone-950 hover:bg-stone-950 hover:text-white"
        >
          {product.price}
        </Link>
      </div>
    </article>
  );
}

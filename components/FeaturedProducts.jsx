import Image from 'next/image';
import { products } from '../data/products';

export default function FeaturedProducts() {
  return (
    <section className="bg-[#f6f0e8] px-5 py-20 md:px-8 md:py-28 lg:px-12">
      <div className="mx-auto max-w-[1680px]">
        <div className="mb-12 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-[10px] font-light uppercase tracking-[.4em] text-stone-500">Curated for you</p>
            <h2 className="mt-4 text-3xl font-normal tracking-[-.035em] text-stone-950 md:text-5xl">
              Featured Bags
            </h2>
          </div>
          <p className="max-w-md text-sm font-light leading-7 text-stone-600">
            Polished forms selected for daily elegance, evening proportion, and modern movement.
          </p>
        </div>

        <div className="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <article key={product.name} className="group">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#ebe4da]">
                <Image
                  fill
                  src={product.image}
                  alt={`ShineYOO ${product.name}`}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="editorial-image object-cover"
                />
              </div>
              <div className="pt-5">
                <h3 className="text-sm font-normal uppercase tracking-[.16em] text-stone-950">{product.name}</h3>
                <p className="mt-3 max-w-xs text-sm font-light leading-6 text-stone-600">{product.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

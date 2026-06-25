import Image from 'next/image';
import { products } from '../data/products';

export default function FeaturedProducts() {
  return (
    <section className="bg-[#fdfbf7] px-5 pb-24 pt-4 md:px-7 lg:px-9">
      <div className="mx-auto max-w-[1900px]">
        <h2 className="mb-9 text-center text-2xl font-normal tracking-[-.03em] text-stone-950 md:mb-12 md:text-3xl">
          Curated for You
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {products.map((product) => (
            <article key={product.name} className="group">
              <div className="relative aspect-[4/4.65] overflow-hidden bg-[#eeeeec]">
                <Image
                  fill
                  src={product.image}
                  alt={`ShineYOO ${product.name}`}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="editorial-image object-cover"
                />
              </div>
              <div className="mx-auto max-w-[88%] pt-5 text-center">
                <h3 className="text-[11px] font-semibold uppercase tracking-[.07em] text-stone-900">{product.name}</h3>
                <p className="mt-2 text-xs font-light leading-5 text-stone-500">{product.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

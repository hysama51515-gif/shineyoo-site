import Link from 'next/link';
import { getProducts } from '../lib/products';
import SafeImage from './SafeImage';

export default async function FeaturedProducts() {
  const products = (await getProducts()).slice(0, 4);

  return (
    <section className="bg-[#fdfbf7] px-5 pb-24 pt-4 md:px-7 lg:px-9">
      <div className="mx-auto max-w-[1900px]">
        <h2 className="mb-9 text-center text-2xl font-normal tracking-[-.03em] text-stone-950 md:mb-12 md:text-3xl">
          Curated for You
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group block">
              <div className="relative aspect-[4/4.65] overflow-hidden bg-[#eeeeec]">
                <SafeImage
                  src={product.main_image || product.image || product.images?.[0] || product.all_images?.[0]}
                  images={product.images}
                  alt={`ShineYOO ${product.title}`}
                  className="editorial-image h-full w-full object-cover"
                />
              </div>
              <div className="mx-auto max-w-[88%] pt-5 text-center">
                <h3 className="text-[11px] font-semibold uppercase tracking-[.07em] text-stone-900">{product.title}</h3>
                <p className="mt-2 text-xs font-light leading-5 text-stone-500">{product.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductById, getProducts } from '../../../lib/products';

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }) {
  const product = await getProductById(params.id);

  return {
    title: product ? `${product.title} | ShineYOO` : 'Product | ShineYOO',
    description: product?.description || 'SHINEYOO editorial product detail.',
  };
}

export default async function LuxuryProductPage({ params }) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  const images = product.images?.length ? product.images : [product.image].filter(Boolean);

  return (
    <main className="min-h-screen bg-[#f7f3ec] text-stone-950">
      <section className="grid min-h-screen lg:grid-cols-[1.16fr_0.84fr]">
        <div className="grid gap-px bg-[#ebe7df] lg:grid-cols-2">
          <figure className="relative col-span-full min-h-[72vh] bg-[#f2eee6]">
            {images[0] && (
              <Image
                priority
                fill
                src={images[0]}
                alt={product.title}
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-contain p-10 md:p-20"
              />
            )}
          </figure>

          {images.slice(1, 5).map((image, index) => (
            <figure key={`${image}-${index}`} className="relative min-h-[46vh] overflow-hidden bg-[#eee9df]">
              <Image
                fill
                src={image}
                alt={`${product.title} editorial detail ${index + 1}`}
                sizes="(max-width: 1024px) 50vw, 29vw"
                className="object-cover transition duration-700 hover:scale-[1.025]"
              />
            </figure>
          ))}
        </div>

        <aside className="px-6 py-14 md:px-12 lg:sticky lg:top-0 lg:h-screen lg:px-20 lg:py-24">
          <div className="mx-auto max-w-xl">
            <div className="flex items-start justify-between gap-10">
              <div>
                <p className="text-[10px] uppercase tracking-[.28em] text-stone-500">
                  SHINEYOO / {product.category}
                </p>
                <h1 className="mt-5 text-4xl font-normal tracking-[-.05em] md:text-5xl">
                  {product.title}
                </h1>
                <p className="mt-5 text-sm font-light leading-7 text-stone-600">{product.description}</p>
              </div>
              <span className="text-lg text-stone-500">♡</span>
            </div>

            {product.price !== '' && product.price !== undefined && (
              <p className="mt-9 text-sm tracking-[.08em] text-stone-950">
                {typeof product.price === 'number' ? `¥${product.price}` : product.price}
              </p>
            )}

            <div className="mt-12">
              <button className="w-full rounded-full bg-stone-950 px-8 py-4 text-sm text-white transition hover:bg-stone-800">
                Request Availability
              </button>
              <p className="mt-5 text-center text-xs font-light leading-6 text-stone-500">
                Each imported piece is reviewed for imagery, naming, category, and editorial fit before campaign use.
              </p>
            </div>

            <div className="mt-12 grid gap-5 border-y border-stone-200 py-8 text-sm font-light text-stone-600 md:grid-cols-2">
              <p>Editorial product page</p>
              <p>Supplier source tracked</p>
              <p>Campaign-ready copy</p>
              <p>Luxury catalogue layout</p>
            </div>

            <section className="mt-10">
              <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <h2 className="text-sm uppercase tracking-[.14em]">Product details</h2>
                <span>⌄</span>
              </div>
              <p className="mt-6 text-sm font-light leading-7 text-stone-600">
                {product.description} Presented in a restrained SHINEYOO visual system with generous spacing,
                quiet typography, and image-first storytelling.
              </p>

              {product.source_url && (
                <Link
                  href={product.source_url}
                  className="mt-7 inline-block text-[10px] uppercase tracking-[.18em] text-stone-500 underline underline-offset-4"
                >
                  Supplier source
                </Link>
              )}
            </section>
          </div>
        </aside>
      </section>
    </main>
  );
}

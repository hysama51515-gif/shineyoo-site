import Link from 'next/link';
import { notFound } from 'next/navigation';
import SafeImage from '../../../components/SafeImage';
import { getProductById, getProducts } from '../../../lib/products';

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }) {
  const product = await getProductById(params.id);

  return {
    title: product ? `${product.title} | ShineYOO` : 'Product | ShineYOO',
    description: product?.description || 'SHINEYOO product detail.',
  };
}

export default async function ProductDetailPage({ params }) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  const images = product.images?.length
    ? product.images
    : product.main_images?.length
      ? product.main_images
      : product.all_images?.length
        ? product.all_images
        : [product.image].filter(Boolean);

  return (
    <section className="grid min-h-screen bg-[#fdfbf7] lg:grid-cols-[1.12fr_0.88fr]">
      <div className="grid gap-px bg-[#fdfbf7] lg:grid-cols-2">
        <div className="relative col-span-full min-h-[72vh] bg-[#f2f1ef]">
          {images[0] && (
            <SafeImage
              src={images[0]}
              images={images}
              alt={product.title}
              loading="eager"
              className="h-full min-h-[72vh] w-full object-contain p-8 md:p-16"
            />
          )}
        </div>

        {images.slice(1, 5).map((image, index) => (
          <div key={`${image}-${index}`} className="relative min-h-[48vh] bg-[#eeeeec]">
            <SafeImage
              src={image}
              images={images}
              alt={`${product.title} detail ${index + 1}`}
              className="h-full min-h-[48vh] w-full object-cover"
            />
          </div>
        ))}
      </div>

      <aside className="px-6 py-16 md:px-12 lg:sticky lg:top-0 lg:h-screen lg:px-20 lg:py-24">
        <div className="mx-auto max-w-xl">
          <div className="flex items-start justify-between gap-8">
            <div>
              <p className="text-[10px] uppercase tracking-[.24em] text-stone-500">{product.category}</p>
              <h1 className="mt-4 text-4xl font-normal tracking-[-.045em] text-stone-950 md:text-5xl">
                {product.title}
              </h1>
              <p className="mt-3 text-sm leading-6 text-stone-500">{product.description}</p>
            </div>
            <span className="text-xl">♡</span>
          </div>

          {product.price && <p className="mt-8 text-sm text-stone-950">{product.price}</p>}

          <div className="mt-12">
            <button className="w-full rounded-full bg-black px-8 py-4 text-sm font-medium text-white transition hover:bg-stone-800">
              Inquire / Add to Bag
            </button>
            <p className="mt-5 text-center text-xs leading-6 text-stone-500">
              Imported catalogue item. Confirm availability and finishing details before production order.
            </p>
          </div>

          <div className="mt-12 grid gap-5 border-y border-stone-200 py-8 text-sm text-stone-600 md:grid-cols-2">
            <p>Client services</p>
            <p>Worldwide sourcing</p>
            <p>Quality review</p>
            <p>Sample confirmation</p>
          </div>

          <div className="mt-10">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <h2 className="text-base uppercase tracking-[.08em] text-stone-950">Product details</h2>
              <span>＋</span>
            </div>
            <p className="mt-6 text-sm leading-7 text-stone-600">
              {product.description} Curated into the SHINEYOO catalogue with an editorial product presentation
              and supplier source tracking.
            </p>
            {product.source_url && (
              <Link
                href={product.source_url}
                className="mt-6 inline-block text-[10px] uppercase tracking-[.18em] text-stone-500 underline"
              >
                1688 source
              </Link>
            )}
          </div>
        </div>
      </aside>
    </section>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { getProducts } from '../../lib/products';

const categories = ['Bags', 'New', 'Evening', 'Accessories'];

export const metadata = {
  title: 'Collection | ShineYOO',
  description: 'Explore the ShineYOO handbag collection through an editorial luxury presentation.',
};

export default async function CollectionPage({ searchParams }) {
  const products = await getProducts();
  const activeCategory = searchParams?.category || 'All';
  const visibleProducts =
    activeCategory === 'All'
      ? products
      : products.filter((product) => product.category === activeCategory);

  return (
    <>
      <section className="bg-[#fdfbf7] px-5 pb-16 pt-20 md:px-8 lg:px-12">
        <div className="mx-auto max-w-[1600px] text-center">
          <p className="text-[10px] uppercase tracking-[.34em] text-stone-500">Collection</p>
          <h1 className="mx-auto mt-5 max-w-4xl text-5xl tracking-[-.055em] text-stone-950 md:text-7xl">
            An edited catalogue of modern handbags.
          </h1>
          <nav className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {['All', ...categories].map((category) => (
              <Link
                key={category}
                href={category === 'All' ? '/collection' : `/collection?category=${category}`}
                className={`px-5 py-2 text-[10px] uppercase tracking-[.16em] ${
                  activeCategory === category
                    ? 'bg-stone-950 text-white'
                    : 'bg-stone-100 text-stone-600 hover:text-stone-950'
                }`}
              >
                {category}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section className="bg-[#fdfbf7] px-5 pb-28 md:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1700px] gap-x-5 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product, index) => (
            <Link
              href={`/products/${product.id}`}
              key={product.id}
              className={`group block ${index % 5 === 0 ? 'lg:col-span-2' : ''}`}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#eeeeec]">
                <Image
                  fill
                  src={product.image || product.images[0]}
                  alt={`ShineYOO ${product.title}`}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="editorial-image object-cover"
                />
              </div>
              <div className="mt-5 flex items-start justify-between gap-6">
                <div>
                  <h2 className="text-sm uppercase tracking-[.12em] text-stone-950">{product.title}</h2>
                  <p className="mt-2 max-w-md text-sm font-light leading-6 text-stone-600">
                    {product.description}
                  </p>
                </div>
                <span className="text-[10px] uppercase tracking-[.16em] text-stone-400">{product.category}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

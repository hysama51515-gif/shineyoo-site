import Image from 'next/image';
import { products } from '../../data/products';

export const metadata = {
  title: 'Collection | ShineYOO',
  description: 'Explore the ShineYOO handbag collection through an editorial luxury presentation.',
};

export default function CollectionPage() {
  return (
    <>
      <section className="flex min-h-screen items-end bg-[#f7f0e7] px-6 pb-16 pt-28 md:px-10 lg:px-14">
        <div className="soft-fade mx-auto w-full max-w-[1600px]">
          <p className="text-[11px] uppercase tracking-[.44em] text-stone-500">Collection</p>
          <h1 className="mt-8 max-w-5xl text-6xl font-semibold uppercase leading-[0.92] tracking-[.06em] text-stone-950 md:text-8xl lg:text-9xl">
            Objects of quiet presence
          </h1>
        </div>
      </section>

      {products.map((product, index) => (
        <section
          key={product.name}
          className="group grid min-h-screen bg-[#f7f0e7] md:grid-cols-2"
        >
          <div className={`${index % 2 === 1 ? 'md:order-2' : ''} relative min-h-[72vh] overflow-hidden`}>
            <Image
              fill
              src={product.image}
              alt={`ShineYOO ${product.name}`}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="editorial-image object-cover"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>

          <div className="flex items-center px-6 py-20 md:px-12 lg:px-20">
            <div className="fade-panel max-w-lg">
              <p className="text-[10px] uppercase tracking-[.42em] text-stone-500">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h2 className="mt-8 text-5xl font-semibold leading-[0.95] tracking-[-.055em] text-stone-950 md:text-7xl">
                {product.name}
              </h2>
              <p className="mt-8 text-lg font-light leading-9 text-stone-600">{product.description}</p>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}

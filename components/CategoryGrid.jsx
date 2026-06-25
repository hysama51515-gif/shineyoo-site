import Image from 'next/image';
import Link from 'next/link';

const categories = [
  {
    title: 'Bags',
    href: '/collection',
    image:
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1600&q=92',
  },
  {
    title: 'New Arrivals',
    href: '/collection',
    image:
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1600&q=92',
  },
  {
    title: 'Evening',
    href: '/collection',
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1600&q=92',
  },
  {
    title: 'Accessories',
    href: '/collection',
    image:
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=92',
  },
];

export default function CategoryGrid() {
  return (
    <section className="bg-[#fdfbf7] px-5 pb-24 pt-7 md:px-7 lg:px-9">
      <h1 className="sr-only">SHINEYOO modern handbags official homepage</h1>

      <div className="mb-11 flex items-center justify-center gap-2">
        <Link
          href="/collection"
          className="bg-stone-950 px-8 py-3 text-[10px] font-medium uppercase tracking-[.06em] text-white"
        >
          Women
        </Link>
        <Link
          href="/collection"
          className="bg-stone-100 px-8 py-3 text-[10px] font-medium uppercase tracking-[.06em] text-stone-700"
        >
          Maison
        </Link>
      </div>

      <div className="mx-auto grid max-w-[1900px] gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {categories.map((category) => (
          <Link key={category.title} href={category.href} className="group block">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#eeeeec]">
              <Image
                fill
                priority={category.title === 'Bags'}
                src={category.image}
                alt={`ShineYOO ${category.title}`}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="editorial-image object-cover"
              />
            </div>
            <p className="mt-5 text-center text-[10px] font-semibold uppercase tracking-[.05em] text-stone-800">
              {category.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

import Image from 'next/image';
import Link from 'next/link';

const categories = [
  {
    title: 'Bags',
    href: '/collection',
    image:
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1400&q=90',
  },
  {
    title: 'New Arrivals',
    href: '/collection',
    image:
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1400&q=90',
  },
  {
    title: 'Evening',
    href: '/collection',
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1400&q=90',
  },
  {
    title: 'Accessories',
    href: '/collection',
    image:
      'https://images.unsplash.com/photo-1614179689702-355944cd0918?auto=format&fit=crop&w=1400&q=90',
  },
];

export default function CategoryGrid() {
  return (
    <section className="bg-[#fbf8f2] px-5 pb-20 pt-10 md:px-8 md:pb-28 lg:px-12">
      <div className="mx-auto max-w-[1680px]">
        <div className="soft-fade mb-10 flex flex-col items-center gap-4 text-center">
          <p className="text-[10px] font-light uppercase tracking-[.4em] text-stone-500">ShineYOO edit</p>
          <h1 className="max-w-3xl text-2xl font-normal leading-snug tracking-[-.025em] text-stone-950 md:text-4xl">
            A refined wardrobe of modern handbags, edited with quiet precision.
          </h1>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {categories.map((category) => (
            <Link key={category.title} href={category.href} className="group block">
              <div className="relative aspect-[3/4.25] overflow-hidden bg-[#eee8df]">
                <Image
                  fill
                  priority={category.title === 'Bags'}
                  src={category.image}
                  alt={`ShineYOO ${category.title}`}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="editorial-image object-cover"
                />
              </div>
              <p className="mt-4 text-center text-[11px] font-light uppercase tracking-[.32em] text-stone-700">
                {category.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

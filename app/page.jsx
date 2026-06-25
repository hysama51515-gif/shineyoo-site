import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

const categories = [
  {
    title: 'Work & Office',
    copy: 'Structured totes and clean silhouettes for focused weekdays.',
    image:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1000&q=86',
  },
  {
    title: 'Daily Casual',
    copy: 'Soft shapes that move easily from coffee runs to late lunches.',
    image:
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=86',
  },
  {
    title: 'Date Night',
    copy: 'Polished minis with a quiet flash of gold-toned detail.',
    image:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=86',
  },
  {
    title: 'Travel / Weekend',
    copy: 'Lightweight crossbodies made for movement and long city walks.',
    image:
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=86',
  },
];

const features = [
  ['Premium Texture', 'Supple vegan leather and tactile finishes chosen for a refined hand feel.'],
  ['Lightweight Carry', 'Designed to hold daily essentials without feeling heavy or overbuilt.'],
  ['Daily Styling', 'Warm neutral tones that pair easily with tailoring, denim, and evening looks.'],
  ['Elegant Structure', 'Clean lines, considered compartments, and softly architectural forms.'],
];

const trust = ['Secure Checkout', 'Worldwide Shipping', 'Quality Guarantee'];

export default function Home() {
  return (
    <>
      <section className="relative min-h-screen overflow-hidden px-5 pb-16 pt-28 md:px-8 lg:px-12">
        <div className="particle-field pointer-events-none absolute inset-0 z-10">
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_50%_0%,rgba(214,184,133,0.28),transparent_62%)]" />

        <div className="mx-auto grid max-w-[1440px] items-end gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="soft-fade relative z-20 pb-4 lg:pb-16">
            <p className="text-[11px] uppercase tracking-[.28em] text-stone-600">ShineYOO Bag Atelier</p>
            <h1 className="mt-7 max-w-3xl text-6xl leading-[0.9] tracking-[-.075em] text-stone-950 md:text-8xl lg:text-[8.7rem]">
              Carry Your Shine
            </h1>
            <p className="mt-8 max-w-md text-base leading-8 text-stone-600 md:text-lg">
              Elegant handbags for modern women — refined enough for the office, soft enough for every day,
              and polished enough for everything after.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className="rounded-full bg-stone-950 px-7 py-4 text-center text-[11px] font-semibold uppercase tracking-[.2em] text-white transition hover:-translate-y-1 hover:bg-stone-800"
              >
                Shop Now
              </Link>
              <Link
                href="/#collection"
                className="rounded-full border border-stone-950/20 bg-white/30 px-7 py-4 text-center text-[11px] font-semibold uppercase tracking-[.2em] text-stone-950 backdrop-blur transition hover:-translate-y-1 hover:border-stone-950"
              >
                Explore Collection
              </Link>
            </div>
          </div>

          <div className="relative z-20 min-h-[520px] lg:min-h-[720px]">
            <div className="float-slow absolute left-0 top-8 z-20 hidden w-48 rounded-full border border-white/40 bg-white/40 px-5 py-4 text-sm leading-6 text-stone-700 shadow-[0_24px_80px_rgba(65,50,36,0.14)] backdrop-blur-xl md:block">
              Soft structure, warm neutrals, everyday elegance.
            </div>
            <div className="relative ml-auto h-[520px] overflow-hidden rounded-[2.5rem] bg-[#ded2c2] shadow-[0_36px_120px_rgba(67,48,32,0.22)] lg:h-[720px] lg:w-[86%]">
              <Image
                priority
                fill
                src="https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1700&q=90"
                alt="Elegant woman carrying a ShineYOO handbag"
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-white/12" />
            </div>
            <div className="float-delay absolute -bottom-7 right-6 z-30 w-56 rounded-[1.5rem] border border-white/45 bg-[#f8f1e8]/78 p-4 shadow-[0_24px_80px_rgba(65,50,36,0.16)] backdrop-blur-xl">
              <p className="text-[10px] uppercase tracking-[.22em] text-stone-500">New Season</p>
              <p className="mt-2 text-lg tracking-[-.04em] text-stone-950">The Atelier Tote</p>
              <p className="mt-1 text-sm text-stone-600">$168 · Signature carry</p>
            </div>
          </div>
        </div>
      </section>

      <section id="collection" className="px-5 py-20 md:px-8 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-[11px] uppercase tracking-[.26em] text-stone-500">Shop by mood</p>
              <h2 className="mt-4 max-w-2xl text-4xl tracking-[-.055em] text-stone-950 md:text-6xl">
                Bags for every version of your day.
              </h2>
            </div>
            <Link href="/products" className="w-fit border-b border-stone-950 pb-2 text-[11px] uppercase tracking-[.18em]">
              View all bags
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {categories.map((category) => (
              <article key={category.title} className="group relative min-h-[420px] overflow-hidden rounded-[2rem] bg-stone-200">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="image-zoom object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/58 via-black/12 to-white/8" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <h3 className="text-2xl tracking-[-.04em]">{category.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/74">{category.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fbf8f2] px-5 py-20 md:px-8 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-11 max-w-3xl">
            <p className="text-[11px] uppercase tracking-[.26em] text-stone-500">Featured bags</p>
            <h2 className="mt-4 text-4xl tracking-[-.055em] text-stone-950 md:text-6xl">
              Quiet luxury, made useful.
            </h2>
          </div>
          <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-24 md:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="relative min-h-[560px] overflow-hidden rounded-[2.5rem] bg-[#ded2c2]">
            <Image
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1500&q=88"
              alt="Editorial fashion styling with a handbag"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/38 via-transparent to-white/8" />
          </div>

          <div className="lg:pl-10">
            <p className="text-[11px] uppercase tracking-[.26em] text-stone-500">Brand story</p>
            <h2 className="mt-5 text-4xl leading-tight tracking-[-.055em] text-stone-950 md:text-6xl">
              Designed for women who dress with intention.
            </h2>
            <p className="mt-7 max-w-xl text-base leading-8 text-stone-600">
              ShineYOO creates bags that balance texture, proportion, practicality, and styling power. Each piece
              is made to feel considered without becoming precious — the bag you reach for before work, after
              dark, and on the weekend.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {features.map(([title, copy]) => (
                <div key={title} className="rounded-[1.5rem] border border-stone-950/10 bg-white/35 p-5 backdrop-blur">
                  <p className="text-sm font-medium text-stone-950">{title}</p>
                  <p className="mt-3 text-sm leading-6 text-stone-600">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-24 md:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1440px] overflow-hidden rounded-[2rem] border border-stone-950/10 bg-[#191714] text-[#f8f1e8] md:grid-cols-3">
          {trust.map((item) => (
            <div key={item} className="border-b border-white/10 p-8 md:border-b-0 md:border-r md:last:border-r-0">
              <p className="text-3xl text-[#d8b36a]">✦</p>
              <h3 className="mt-5 text-xl tracking-[-.035em]">{item}</h3>
              <p className="mt-3 text-sm leading-6 text-white/58">
                A polished shopping experience with thoughtful service from inquiry to delivery.
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

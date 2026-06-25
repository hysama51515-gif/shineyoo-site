import Image from 'next/image';
import Link from 'next/link';

const chapters = [
  {
    eyebrow: 'Craftsmanship',
    title: 'A silhouette drawn with restraint.',
    copy:
      'Each ShineYOO piece is shaped around proportion, balance, and the quiet confidence of a bag that does not need to announce itself.',
  },
  {
    eyebrow: 'Materials',
    title: 'Soft structure. Precise touch.',
    copy:
      'Warm neutrals, tactile finishes, and polished hardware are chosen to create a considered object for daily elegance.',
  },
  {
    eyebrow: 'Heritage storytelling',
    title: 'Modern codes, timeless rhythm.',
    copy:
      'ShineYOO speaks in a language of light, texture, and movement — made for women who carry their world with intention.',
  },
];

export default function Home() {
  return (
    <>
      <section className="relative h-screen min-h-[720px] overflow-hidden bg-stone-950 text-white">
        <Image
          priority
          fill
          src="https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=2200&q=92"
          alt="ShineYOO modern luxury handbag campaign"
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/28 via-black/12 to-black/45" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,transparent_0%,rgba(0,0,0,0.2)_68%,rgba(0,0,0,0.48)_100%)]" />

        <div className="soft-fade absolute inset-x-0 bottom-16 z-10 mx-auto flex max-w-[1440px] flex-col items-center px-6 text-center md:bottom-20">
          <h1 className="text-5xl font-semibold uppercase leading-[0.95] tracking-[.16em] md:text-7xl lg:text-8xl">
            Carry Your Shine
          </h1>
          <p className="mt-6 max-w-2xl text-sm font-light uppercase tracking-[.32em] text-white/78 md:text-base">
            Modern handbags crafted for timeless elegance
          </p>
        </div>
      </section>

      {chapters.map((chapter, index) => (
        <section
          key={chapter.eyebrow}
          className="slow-section flex min-h-screen items-center bg-[#f7f0e7] px-6 py-28 text-stone-950 md:px-10 lg:px-16"
        >
          <div className="mx-auto grid w-full max-w-[1440px] gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div className="fade-panel">
              <p className="text-[11px] uppercase tracking-[.42em] text-stone-500">{chapter.eyebrow}</p>
              <h2 className="mt-8 max-w-2xl text-5xl font-semibold leading-[0.94] tracking-[-.055em] md:text-7xl">
                {chapter.title}
              </h2>
            </div>
            <div className="fade-panel lg:pb-4">
              <p className="max-w-xl text-lg font-light leading-9 text-stone-600">{chapter.copy}</p>
              <div className="mt-12 h-px w-full bg-stone-950/12" />
              <div className="mt-5 flex items-center justify-between text-[10px] uppercase tracking-[.34em] text-stone-500">
                <span>SHINEYOO</span>
                <span>{String(index + 1).padStart(2, '0')} / 03</span>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="flex min-h-screen items-center justify-center bg-[#151311] px-6 py-28 text-center text-[#f7f0e7]">
        <div className="soft-fade max-w-4xl">
          <p className="text-[11px] uppercase tracking-[.42em] text-white/46">The collection</p>
          <h2 className="mt-8 text-5xl font-semibold leading-[0.95] tracking-[-.055em] md:text-7xl">
            An edited language of form, texture, and movement.
          </h2>
          <Link
            href="/collection"
            className="mt-12 inline-flex border-b border-white/70 pb-2 text-[11px] uppercase tracking-[.32em] text-white/82 transition hover:border-white hover:text-white"
          >
            Enter collection
          </Link>
        </div>
      </section>
    </>
  );
}

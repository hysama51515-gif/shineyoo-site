import Image from 'next/image';

export const metadata = {
  title: 'About | ShineYOO',
  description: 'The design philosophy behind ShineYOO, a modern handbag house.',
};

export default function AboutPage() {
  return (
    <>
      <section className="flex min-h-screen items-end bg-[#f7f0e7] px-6 pb-16 pt-28 md:px-10 lg:px-14">
        <div className="soft-fade mx-auto w-full max-w-[1600px]">
          <p className="text-[11px] uppercase tracking-[.44em] text-stone-500">About the house</p>
          <h1 className="mt-8 max-w-6xl text-6xl font-semibold leading-[0.92] tracking-[-.06em] text-stone-950 md:text-8xl">
            Elegance shaped by restraint.
          </h1>
        </div>
      </section>

      <section className="grid min-h-screen bg-[#fbf7f0] md:grid-cols-2">
        <div className="relative min-h-[70vh] overflow-hidden">
          <Image
            fill
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=90"
            alt="ShineYOO editorial fashion mood"
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className="flex items-center px-6 py-20 md:px-12 lg:px-20">
          <div className="fade-panel max-w-xl">
            <p className="text-[11px] uppercase tracking-[.42em] text-stone-500">Philosophy</p>
            <h2 className="mt-8 text-5xl font-semibold leading-[0.95] tracking-[-.055em] text-stone-950 md:text-7xl">
              The bag as an architectural gesture.
            </h2>
            <p className="mt-8 text-lg font-light leading-9 text-stone-600">
              ShineYOO studies the quiet tension between function and presence. Every line is edited, every
              proportion considered, every finish chosen to live with grace rather than excess.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

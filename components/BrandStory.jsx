import SafeImage from './SafeImage';

export default function BrandStory() {
  return (
    <section className="bg-[#fdfbf7] px-5 py-24 md:px-7 md:py-32 lg:px-9">
      <div className="mx-auto grid max-w-[1500px] gap-16 border-t border-stone-950/10 pt-20 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px] overflow-hidden bg-[#eeeeec] md:mx-0">
          <SafeImage
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1500&q=90"
            images={['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1500&q=90']}
            alt="ShineYOO editorial atelier mood"
            className="editorial-image h-full w-full object-cover"
          />
        </div>

        <div className="mx-auto max-w-2xl text-center md:text-left">
          <p className="text-[10px] font-semibold uppercase tracking-[.08em] text-stone-500">Atelier notes</p>
          <h2 className="mt-7 text-4xl font-normal leading-[1.08] tracking-[-.04em] text-stone-950 md:text-6xl">
            Quiet luxury, carried lightly.
          </h2>
          <p className="mt-8 text-base font-light leading-8 text-stone-600 md:text-lg md:leading-9">
            ShineYOO designs handbags for modern women through proportion, tactile restraint, and daily ease.
            Each piece is composed to complete a silhouette with calm precision.
          </p>
        </div>
      </div>
    </section>
  );
}

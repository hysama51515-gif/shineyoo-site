import BatchImportClient from './BatchImportClient';

export const metadata = {
  title: 'Batch Import | ShineYOO Admin',
  description: 'Batch import 1688 products and transform them into SHINEYOO luxury catalogue items.',
};

export default function BatchImportPage() {
  return (
    <main className="min-h-screen bg-[#f7f3ec] px-5 py-16 text-stone-950 md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1500px]">
        <p className="text-[10px] uppercase tracking-[.34em] text-stone-500">ShineYOO atelier system</p>
        <div className="mt-5 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <h1 className="max-w-4xl text-5xl font-normal tracking-[-.055em] md:text-7xl">
              1688 batch import, refined into a luxury catalogue.
            </h1>
          </div>
          <p className="max-w-xl text-sm font-light leading-7 text-stone-600">
            Paste 10–100 supplier links. Each listing is opened server-side, enriched into editorial
            SHINEYOO language, then saved into the live product JSON for automatic storefront rendering.
          </p>
        </div>

        <BatchImportClient />
      </div>
    </main>
  );
}

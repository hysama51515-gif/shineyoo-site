import AdminPanelClient from './AdminPanelClient';
import { getProducts } from '../../lib/products';

export const metadata = {
  title: 'ShineYOO Admin Panel',
  description: '1688 visual product importer and publishing panel for ShineYOO.',
};

export default async function AdminPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-[#f7f3ec] px-5 py-16 text-stone-950 md:px-8 lg:px-12">
      <div className="mx-auto max-w-[1720px]">
        <div className="flex flex-col gap-8 border-b border-stone-200 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[.34em] text-stone-500">SHINEYOO ADMIN PANEL</p>
            <h1 className="mt-5 max-w-5xl text-5xl font-normal tracking-[-.055em] md:text-7xl">
              1688 visual publishing studio.
            </h1>
          </div>
          <p className="max-w-lg text-sm font-light leading-7 text-stone-600">
            Paste a supplier link, capture all gallery/detail/SKU imagery, curate the selected visuals, then publish
            directly into the ShineYOO product catalogue.
          </p>
        </div>

        <AdminPanelClient initialProducts={products} />
      </div>
    </main>
  );
}

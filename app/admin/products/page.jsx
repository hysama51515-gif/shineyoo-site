import AdminProductsClient from './AdminProductsClient';
import { getProducts } from '../../../lib/products';

export const metadata = {
  title: 'Product Admin | ShineYOO',
};

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <section className="min-h-screen bg-[#f7f0e7] px-5 py-24 md:px-8 lg:px-12">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-10">
          <p className="text-[10px] uppercase tracking-[.34em] text-stone-500">SHINEYOO ADMIN</p>
          <h1 className="mt-4 text-5xl tracking-[-.055em] text-stone-950 md:text-7xl">
            Product publishing
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-600">
            Paste a 1688 product link, extract images and title, then curate it into the luxury-front product
            catalogue.
          </p>
          <p className="mt-3 max-w-2xl text-xs leading-6 text-stone-500">
            Local dev writes directly to data/products.json. On Vercel, set GITHUB_TOKEN and GITHUB_REPO to publish
            JSON changes back to GitHub and trigger deployment.
          </p>
        </div>

        <AdminProductsClient initialProducts={products} />
      </div>
    </section>
  );
}

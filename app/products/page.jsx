import ProductCard from '../../components/ProductCard';
import { products } from '../../data/products';

export const metadata = { title: 'Products | ShineYOO' };
export default function ProductsPage() { return <section className="px-5 py-16 md:px-8 md:py-24"><div className="mx-auto max-w-7xl"><p className="text-[10px] uppercase tracking-[.2em] text-black/50">The collection</p><div className="mt-4 flex flex-col justify-between gap-5 border-b border-black/15 pb-8 sm:flex-row sm:items-end"><h1 className="text-5xl tracking-[-.055em] md:text-6xl">Everyday objects,<br />extraordinary care.</h1><p className="text-xs uppercase tracking-[.14em] text-black/50">6 products</p></div><div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{products.map(product => <ProductCard key={product.name} product={product} />)}</div></div></section>; }

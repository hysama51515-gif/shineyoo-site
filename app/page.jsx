import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

const reviews = [['“The little reset my morning needed.”', '— LIN, SHANGHAI'], ['“Beautiful, quiet, and genuinely useful.”', '— MEI, HANGZHOU'], ['“Every detail feels considered.”', '— YU, BEIJING']];

export default function Home() {
  return (<>
    <section className="grid min-h-[calc(100vh-4rem)] bg-cream md:grid-cols-2">
      <div className="flex flex-col justify-end px-5 pb-14 pt-20 md:px-12 md:pb-20 lg:px-20"><p className="mb-6 text-[10px] uppercase tracking-[.2em] text-black/55">Daily rituals, considered</p><h1 className="max-w-xl text-5xl leading-[.98] tracking-[-.055em] md:text-7xl lg:text-8xl">A softer way to begin again.</h1><p className="mt-7 max-w-sm text-sm leading-6 text-black/65">Mindful objects for skin, space, and the rhythm between.</p><Link href="/products" className="mt-9 w-fit border-b border-black pb-2 text-[11px] font-medium uppercase tracking-[.16em]">Shop the collection</Link></div>
      <div className="relative min-h-[470px] md:min-h-full"><Image priority fill src="https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=1600&q=90" alt="ShineYOO daily ritual" sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" /></div>
    </section>
    <section className="px-5 py-24 md:px-8 md:py-36"><div className="mx-auto max-w-3xl text-center"><p className="text-[10px] uppercase tracking-[.2em] text-black/50">Our point of view</p><h2 className="mt-6 text-3xl leading-tight tracking-[-.04em] md:text-5xl">Small rituals can change the texture of a day.</h2><p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-black/60">ShineYOO is a collection of thoughtfully made essentials that invite you to pause, notice, and come back to yourself.</p></div></section>
    <section className="bg-[#eee9df] px-5 py-16 md:px-8 md:py-24"><div className="mx-auto max-w-7xl"><div className="mb-9 flex items-end justify-between"><div><p className="text-[10px] uppercase tracking-[.2em] text-black/50">The collection</p><h2 className="mt-3 text-3xl tracking-[-.04em] md:text-4xl">Made for every day</h2></div><Link className="hidden border-b border-black pb-1 text-[10px] uppercase tracking-[.15em] sm:block" href="/products">View all</Link></div><div className="grid gap-6 md:grid-cols-3">{products.slice(0,3).map(product => <ProductCard key={product.name} product={product} />)}</div></div></section>
    <section className="px-5 py-24 md:px-8 md:py-32"><div className="mx-auto max-w-7xl"><p className="text-center text-[10px] uppercase tracking-[.2em] text-black/50">Words from our community</p><div className="mt-12 grid border-t border-black/15 md:grid-cols-3">{reviews.map(([quote, author]) => <blockquote key={author} className="border-b border-black/15 py-9 text-center md:border-b-0 md:px-8 md:py-12 md:not-last:border-r"><p className="text-xl leading-snug tracking-[-.03em]">{quote}</p><footer className="mt-5 text-[9px] tracking-[.16em] text-black/45">{author}</footer></blockquote>)}</div></div></section>
  </>);
}

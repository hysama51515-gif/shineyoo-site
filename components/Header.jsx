import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[#fdfcf9]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <Link href="/" className="text-lg font-bold tracking-[.22em]">SHINEYOO</Link>
        <nav className="flex items-center gap-5 text-[11px] font-medium uppercase tracking-[.16em] md:gap-8">
          <Link href="/products" className="hover:opacity-55">Products</Link>
          <Link href="/about" className="hover:opacity-55">Our story</Link>
          <button aria-label="购物袋" className="hidden h-9 w-9 rounded-full border border-black/15 text-base transition hover:bg-black hover:text-white sm:block">0</button>
        </nav>
      </div>
    </header>
  );
}

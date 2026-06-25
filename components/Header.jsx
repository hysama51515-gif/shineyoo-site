import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#fdfbf7]/98">
      <div className="relative mx-auto flex h-[86px] max-w-[1920px] items-center justify-center px-5 md:px-8">
        <nav className="absolute left-5 flex items-center gap-5 text-[10px] font-medium uppercase tracking-[.08em] text-stone-700 md:left-8">
          <Link href="/collection" className="leading-none transition hover:text-stone-950">
            Menu
          </Link>
          <Link href="/collection" className="leading-none transition hover:text-stone-950">
            Search
          </Link>
        </nav>

        <Link
          href="/"
          className="text-[26px] font-semibold uppercase leading-none tracking-[-.03em] text-stone-950 md:text-[30px]"
        >
          SHINEYOO
        </Link>

        <nav className="absolute right-5 hidden items-center gap-5 text-[10px] font-medium uppercase tracking-[.08em] text-stone-700 md:right-8 md:flex">
          <Link href="/about" className="transition hover:text-stone-950">
            Account
          </Link>
          <Link href="/collection" className="transition hover:text-stone-950">
            Wishlist
          </Link>
          <Link href="/collection" className="transition hover:text-stone-950">
            Bag
          </Link>
        </nav>
      </div>
    </header>
  );
}

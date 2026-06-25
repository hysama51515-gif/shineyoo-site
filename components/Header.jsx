import Link from 'next/link';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/products' },
  { label: 'Collection', href: '/#collection' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/#contact' },
];

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-[#f8f1e8]/75 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-[1440px] items-center justify-between px-5 md:px-8 lg:px-12">
        <Link href="/" className="text-lg font-semibold tracking-[.28em] text-stone-950">
          SHINEYOO
        </Link>

        <nav className="hidden items-center gap-8 text-[11px] font-medium uppercase tracking-[.18em] text-stone-700 md:flex">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="transition hover:text-stone-950">
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/products"
          aria-label="Shopping bag"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-950/15 bg-white/35 text-sm transition hover:-translate-y-0.5 hover:border-stone-950 hover:bg-stone-950 hover:text-white"
        >
          ♡
        </Link>
      </div>
    </header>
  );
}

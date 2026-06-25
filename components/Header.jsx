import Link from 'next/link';

const leftNav = [
  { label: 'Menu', href: '/collection' },
  { label: 'Search', href: '/collection' },
];

const rightNav = [
  { label: 'Account', href: '/about' },
  { label: 'Wishlist', href: '/collection' },
  { label: 'Bag', href: '/collection' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-950/8 bg-[#fbf8f2]/96 backdrop-blur-md">
      <div className="mx-auto grid h-20 max-w-[1680px] grid-cols-3 items-center px-5 md:px-8 lg:px-12">
        <nav className="flex items-center gap-5 text-[10px] font-light uppercase tracking-[.28em] text-stone-600 md:gap-8">
          {leftNav.map((item) => (
            <Link key={item.label} href={item.href} className="transition hover:text-stone-950">
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/"
          className="justify-self-center text-lg font-semibold uppercase tracking-[.44em] text-stone-950"
        >
          SHINEYOO
        </Link>

        <nav className="hidden justify-self-end md:flex md:items-center md:gap-8 text-[10px] font-light uppercase tracking-[.28em] text-stone-600">
          {rightNav.map((item) => (
            <Link key={item.label} href={item.href} className="transition hover:text-stone-950">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

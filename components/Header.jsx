import Link from 'next/link';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Collection', href: '/collection' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/#contact' },
];

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-transparent">
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-6 text-stone-950 mix-blend-difference md:px-10 lg:px-14">
        <Link href="/" className="text-base font-semibold uppercase tracking-[.42em] text-white">
          SHINEYOO
        </Link>

        <nav className="hidden items-center gap-10 text-[10px] font-light uppercase tracking-[.34em] text-white md:flex">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="transition hover:opacity-55">
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/collection"
          className="text-[10px] font-light uppercase tracking-[.34em] text-white transition hover:opacity-55 md:hidden"
        >
          Menu
        </Link>
      </div>
    </header>
  );
}

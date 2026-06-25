import Link from 'next/link';

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#fbf8f2] px-5 py-16 text-stone-950 md:px-8 lg:px-12">
      <div className="mx-auto grid max-w-[1680px] gap-12 border-t border-stone-950/10 pt-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <p className="text-base font-semibold uppercase tracking-[.42em]">SHINEYOO</p>
          <p className="mt-5 max-w-sm text-sm font-light leading-7 text-stone-600">
            Modern handbags composed through proportion, texture, and restraint.
          </p>
        </div>

        <nav className="text-[11px] font-light uppercase tracking-[.28em] text-stone-600">
          <Link className="block py-2 transition hover:text-stone-950" href="/">
            Home
          </Link>
          <Link className="block py-2 transition hover:text-stone-950" href="/collection">
            Collection
          </Link>
          <Link className="block py-2 transition hover:text-stone-950" href="/about">
            About
          </Link>
        </nav>

        <div className="text-[11px] font-light uppercase tracking-[.28em] text-stone-600">
          <p className="py-2">Instagram</p>
          <p className="py-2">Pinterest</p>
          <p className="py-2">WeChat</p>
        </div>

        <div className="text-sm font-light leading-7 text-stone-600">
          <p className="text-[11px] uppercase tracking-[.28em] text-stone-950">Contact</p>
          <p className="mt-4">hello@shineyoo.shop</p>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-[1680px] text-[10px] font-light uppercase tracking-[.28em] text-stone-500">
        © 2026 ShineYOO
      </div>
    </footer>
  );
}

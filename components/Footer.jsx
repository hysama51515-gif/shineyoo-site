import Link from 'next/link';

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#f7f0e7] px-6 py-16 text-stone-950 md:px-10 lg:px-14">
      <div className="mx-auto grid max-w-[1600px] gap-12 border-t border-stone-950/12 pt-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="text-base font-semibold uppercase tracking-[.42em]">SHINEYOO</p>
          <p className="mt-6 max-w-sm text-sm font-light leading-7 text-stone-600">
            A modern handbag house exploring elegance through form, texture, and restraint.
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

        <div className="text-sm font-light leading-7 text-stone-600">
          <p className="text-[11px] uppercase tracking-[.28em] text-stone-950">Contact</p>
          <p className="mt-4">hello@shineyoo.shop</p>
          <p>Instagram · Pinterest · WeChat</p>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-[1600px] text-[10px] font-light uppercase tracking-[.28em] text-stone-500">
        © 2026 ShineYOO
      </div>
    </footer>
  );
}

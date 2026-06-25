import Link from 'next/link';

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#161412] px-5 py-14 text-[#f8f1e8] md:px-8 lg:px-12">
      <div className="mx-auto grid max-w-[1440px] gap-12 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div>
          <p className="text-xl font-semibold tracking-[.28em]">SHINEYOO</p>
          <p className="mt-5 max-w-sm text-sm leading-7 text-white/58">
            Modern bags for women who move between work, travel, dinner, and the quiet in-between.
          </p>
        </div>

        <div className="text-sm text-white/58">
          <p className="mb-4 text-[10px] uppercase tracking-[.22em] text-white">Explore</p>
          <Link className="block py-1.5 transition hover:text-white" href="/products">
            Shop
          </Link>
          <Link className="block py-1.5 transition hover:text-white" href="/#collection">
            Collection
          </Link>
          <Link className="block py-1.5 transition hover:text-white" href="/about">
            About
          </Link>
        </div>

        <div className="text-sm text-white/58">
          <p className="mb-4 text-[10px] uppercase tracking-[.22em] text-white">Social</p>
          <p className="py-1.5">Instagram</p>
          <p className="py-1.5">Pinterest</p>
          <p className="py-1.5">TikTok</p>
        </div>

        <div className="text-sm text-white/58">
          <p className="mb-4 text-[10px] uppercase tracking-[.22em] text-white">Contact</p>
          <p className="leading-7">hello@shineyoo.shop</p>
          <p className="mt-2 leading-7">WhatsApp inquiry available for wholesale and styling help.</p>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-[1440px] flex-col gap-3 border-t border-white/12 pt-6 text-[10px] uppercase tracking-[.18em] text-white/38 md:flex-row md:items-center md:justify-between">
        <span>© 2026 ShineYOO. All rights reserved.</span>
        <span>Secure checkout · Worldwide shipping · Quality guarantee</span>
      </div>
    </footer>
  );
}

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1c1c1a] px-5 py-12 text-[#f6f3ed] md:px-8 md:py-16">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[2fr_1fr_1fr]">
        <div><p className="text-lg font-bold tracking-[.22em]">SHINEYOO</p><p className="mt-5 max-w-xs text-sm leading-6 text-white/60">For the small moments that make every day feel like yours.</p></div>
        <div className="text-sm text-white/65"><p className="mb-3 text-[10px] uppercase tracking-[.18em] text-white">Explore</p><Link className="block py-1 hover:text-white" href="/products">Products</Link><Link className="block py-1 hover:text-white" href="/about">About us</Link></div>
        <div className="text-sm text-white/65"><p className="mb-3 text-[10px] uppercase tracking-[.18em] text-white">Stay in touch</p><p className="leading-6">Notes on thoughtful living, arriving occasionally.</p><div className="mt-4 border-b border-white/40 pb-2 text-xs text-white">YOUR EMAIL →</div></div>
      </div>
      <div className="mx-auto mt-14 max-w-7xl border-t border-white/15 pt-5 text-[10px] uppercase tracking-[.14em] text-white/40">© 2025 ShineYOO. Made slowly, shared widely.</div>
    </footer>
  );
}

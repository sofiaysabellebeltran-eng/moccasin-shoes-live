import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { PRODUCT_CATALOG, getSeriesList, formatPHP } from "../shared/catalog";

export default function ProductsPage() {
  const seriesList = useMemo(() => getSeriesList(), []);
  const [activeSeries, setActiveSeries] = useState<string | null>(null);
  const visible = useMemo(() => activeSeries ? PRODUCT_CATALOG.filter(p => p.series === activeSeries) : PRODUCT_CATALOG, [activeSeries]);

  return (
    <div>
      {/* --- MEGA BUNDLE HERO --- */}
      <section className="bg-[#1a1a1a] text-[#faf9f7] px-6 py-24 md:px-10 md:py-32">
        <div className="max-w-[1440px] mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/50 mb-4">The Ultimate Package · Physical + Digital</p>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-[-0.03em] leading-[0.9] mb-6">
              The Mega<br/>Bundle
            </h1>
            <p className="text-sm md:text-base text-white/70 mb-8 max-w-md leading-relaxed">
              Equip your business and your wardrobe. Get <strong>5 pairs of premium Moccasin shoes</strong> plus the <strong>50-App Digital Bundle</strong>. Everything you need to look good and generate revenue immediately.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/bundle" className="bg-[#faf9f7] text-[#1a1a1a] px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-white transition">
                Buy Bundle - ₱7,500
              </Link>
              <span className="text-xs font-medium tracking-widest text-white/50 uppercase">Limited Offer</span>
            </div>
          </div>
          <div className="aspect-square bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition duration-700" />
            <span className="text-white/20 text-5xl md:text-7xl font-black tracking-tighter text-center leading-tight">5 SHOES<br/>+<br/>50 APPS</span>
          </div>
        </div>
      </section>

      {/* --- PHYSICAL STORE COLLECTION --- */}
      <header className="border-b border-black/5 px-6 py-16 md:px-10 bg-[#faf9f7]">
        <h2 className="text-4xl font-black uppercase tracking-[-0.03em] md:text-6xl">The Collection</h2>
        <p className="mt-3 max-w-lg text-sm text-black/60">30 designs. Filipino craftsmanship. {PRODUCT_CATALOG.length} pairs across four series.</p>
      </header>

      <nav className="sticky top-[73px] z-10 border-b border-black/5 bg-[#faf9f7]/90 px-6 py-3 backdrop-blur md:px-10">
        <div className="flex flex-wrap gap-2 text-[11px] font-medium uppercase tracking-[0.15em]">
          <button onClick={() => setActiveSeries(null)} className={`rounded-full px-4 py-2 transition ${activeSeries === null ? "bg-black text-white" : "border border-black/15 hover:border-black"}`}>All ({PRODUCT_CATALOG.length})</button>
          {seriesList.map(series => (
            <button key={series} onClick={() => setActiveSeries(series)} className={`rounded-full px-4 py-2 transition ${activeSeries === series ? "bg-black text-white" : "border border-black/15 hover:border-black"}`}>
              {series} ({PRODUCT_CATALOG.filter(p => p.series === series).length})
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-[1440px] px-6 py-12 md:px-10 md:py-16 bg-[#faf9f7]">
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map(product => (
            <Link key={product.id} to={`/products/${product.id}`} className="group block">
              <div className="relative aspect-square overflow-hidden bg-[#e8e4df]">
                <img src={product.imageUrl} alt={product.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <span className="absolute left-3 top-3 bg-white px-2 py-1 text-[9px] font-bold uppercase tracking-[0.2em]">{product.productCode}</span>
              </div>
              <div className="mt-3 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.1em]">{product.name}</h3>
                  <p className="mt-0.5 text-[11px] text-black/50">{product.series}</p>
                </div>
                <p className="text-xs font-medium tabular-nums">{formatPHP(product.pricePhp)}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

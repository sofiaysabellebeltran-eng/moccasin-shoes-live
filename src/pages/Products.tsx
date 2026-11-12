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
      <section className="bg-[#1a1a1a] text-[#faf9f7] px-6 py-20 md:px-10 md:py-28">
        <div className="max-w-[1440px] mx-auto grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#faf9f7]/50 mb-4">Physical + Digital Package</p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-[-0.03em] leading-[0.85] mb-6">
              The Mega<br/>Bundle
            </h1>
            <p className="text-sm md:text-base text-[#faf9f7]/70 mb-8 max-w-md leading-relaxed">
              The ultimate business and lifestyle package. Equip your wardrobe with <strong className="text-white">5 premium Moccasin shoes</strong> and scale your income with the <strong className="text-white">50-App Digital Bundle</strong>.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <Link to="/bundle" className="bg-[#faf9f7] text-[#1a1a1a] px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-white transition">
                Buy Bundle - ₱7,500
              </Link>
              <span className="text-xs font-medium tracking-widest text-[#faf9f7]/50 uppercase">Save ₱3,000+</span>
            </div>
          </div>

          <div className="relative aspect-square md:aspect-[4/3] bg-white/5 border border-white/10 rounded-sm overflow-hidden group">
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-3 gap-1 p-2">
              <div className="col-span-2 row-span-2 relative overflow-hidden bg-[#e8e4df]">
                <img src="/products/makabayan-series-agila.jpg" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt="Shoe 1" />
              </div>
              <div className="relative overflow-hidden bg-[#e8e4df]">
                <img src="/products/bayani-habi-series-bonifacio.jpg" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt="Shoe 2" />
              </div>
              <div className="relative overflow-hidden bg-[#e8e4df]">
                <img src="/products/bayani-tutos-series-aguinaldo.jpg" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt="Shoe 3" />
              </div>
              <div className="relative overflow-hidden bg-[#e8e4df]">
                <img src="/products/moxies-lite-marikit.jpg" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt="Shoe 4" />
              </div>
              <div className="relative overflow-hidden bg-[#e8e4df]">
                <img src="/products/moxies-lite-hiraya.jpg" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt="Shoe 5" />
              </div>
            </div>
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 p-6 md:p-8 text-center shadow-2xl">
              <p className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">+50 Apps</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#faf9f7]/70 mt-1">Digital Delivery</p>
            </div>
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

import { Link, Outlet } from "react-router-dom";
import { useCart } from "../context/CartContext";
import SupportWidget from "./SupportWidget";

export default function Layout() {
  const { items } = useCart();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1a1a1a]">
      <header className="sticky top-0 z-50 bg-[#faf9f7]/90 backdrop-blur border-b border-black/5 px-6 py-4 md:px-10 flex items-center justify-between">
        <Link to="/" className="flex items-center hover:opacity-80 transition">
          <img src="/logo.png" alt="Moccasin" className="h-10 md:h-12 w-auto object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
          <span className="hidden text-2xl font-black uppercase tracking-widest">Moccasin</span>
        </Link>
        <Link to="/cart" className="text-xs font-bold uppercase tracking-widest border border-black/20 px-5 py-2.5 rounded-full hover:border-black transition shadow-sm hover:shadow-md">
          Cart ({count})
        </Link>
      </header>
      
      <main>
        <Outlet />
      </main>

      {/* This now loads the new Live AI Chat component */}
      <SupportWidget />
    </div>
  );
}

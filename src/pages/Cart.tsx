import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPHP } from "../shared/catalog";

export default function CartPage() {
  const { items, removeFromCart, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-black uppercase tracking-tight mb-4">Your Bag is Empty</h1>
        <Link to="/" className="bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-black/80">Shop the Collection</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
      <h1 className="text-3xl font-black uppercase tracking-tight mb-8">Your Bag</h1>
      <div className="space-y-6">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-6 border-b border-black/10 pb-6">
            <img src={item.product.imageUrl} alt={item.product.name} className="w-24 h-24 object-cover bg-[#e8e4df]" />
            <div className="flex-1">
              <h3 className="font-bold uppercase tracking-widest text-sm">{item.product.name}</h3>
              <p className="text-sm text-black/50">Size {item.size} · Qty {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">{formatPHP(item.product.pricePhp * item.quantity)}</p>
              <button onClick={() => removeFromCart(item.product.id, item.size)} className="text-xs text-red-500 hover:underline mt-2">Remove</button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-10 flex justify-between items-end border-t border-black/20 pt-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-black/50">Total</p>
          <p className="text-3xl font-black">{formatPHP(total)}</p>
        </div>
        <Link to="/checkout" className="bg-black text-white px-10 py-5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-black/80 transition inline-block">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}

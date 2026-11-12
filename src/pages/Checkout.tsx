import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPHP } from "../shared/catalog";
import { calculateShipping, SHIPPING_ZONE_LABELS, ShippingZone } from "../shared/shipping";

export default function CheckoutPage() {
  const { items, total } = useCart();
  const navigate = useNavigate();
  const [zone, setZone] = useState<ShippingZone>("metroManila");
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (items.length === 0) { navigate("/cart"); return null; }

  const shippingFee = calculateShipping(total, zone);
  const finalTotal = total + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const reference = "MOC-" + Date.now();
      
      // Save order details for the success page
      localStorage.setItem("pendingOrder", JSON.stringify({ reference, customer: form, items, total: finalTotal }));

      const response = await fetch("${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, shippingFee, customer: form, reference, origin: window.location.origin }),
      });

      const data = await response.json();
      if (data.checkoutUrl) window.location.href = data.checkoutUrl;
      else { alert("Error creating session"); setIsSubmitting(false); }
    } catch (error) {
      alert("Network error.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-16">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight mb-8">Checkout</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required type="text" placeholder="Full Name" className="w-full border border-black/20 p-3 text-sm focus:outline-none" onChange={e => setForm({...form, name: e.target.value})} />
          <input required type="email" placeholder="Email Address" className="w-full border border-black/20 p-3 text-sm focus:outline-none" onChange={e => setForm({...form, email: e.target.value})} />
          <input required type="tel" placeholder="Phone Number" className="w-full border border-black/20 p-3 text-sm focus:outline-none" onChange={e => setForm({...form, phone: e.target.value})} />
          <input required type="text" placeholder="Street Address" className="w-full border border-black/20 p-3 text-sm focus:outline-none" onChange={e => setForm({...form, address: e.target.value})} />
          <input required type="text" placeholder="City" className="w-full border border-black/20 p-3 text-sm focus:outline-none" onChange={e => setForm({...form, city: e.target.value})} />
          <select value={zone} onChange={e => setZone(e.target.value as ShippingZone)} className="w-full border border-black/20 p-3 text-sm bg-white">
            {Object.entries(SHIPPING_ZONE_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
          <button disabled={isSubmitting} type="submit" className="w-full bg-black text-white text-xs font-bold uppercase tracking-[0.2em] py-5 mt-8 hover:bg-black/80">
            {isSubmitting ? "Redirecting..." : `Pay ${formatPHP(finalTotal)}`}
          </button>
        </form>
      </div>
      <div className="bg-[#f2efe9] p-8 h-fit">
        <h2 className="text-xs font-bold uppercase tracking-widest text-black/50 mb-6">Order Summary</h2>
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center text-sm mb-4">
            <div><p className="font-bold uppercase tracking-widest text-xs">{item.product.name}</p><p className="text-black/50 text-xs">Qty {item.quantity}</p></div>
            <p className="font-medium">{formatPHP(item.product.pricePhp * item.quantity)}</p>
          </div>
        ))}
        <div className="border-t border-black/10 pt-4 text-sm mt-4"><div className="flex justify-between font-black text-lg"><span>Total</span><span>{formatPHP(finalTotal)}</span></div></div>
      </div>
    </div>
  );
}


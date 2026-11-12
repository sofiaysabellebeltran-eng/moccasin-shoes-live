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
  const [showQR, setShowQR] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("gcash");
  const [paymentRef, setPaymentRef] = useState("");

  if (items.length === 0) { navigate("/cart"); return null; }

  const shippingFee = calculateShipping(total, zone);
  const finalTotal = total + shippingFee;

  const handleProceedToQR = (e: React.FormEvent) => {
    e.preventDefault();
    setShowQR(true);
  };

  const handleConfirmPayment = () => {
    if (!paymentRef.trim()) {
      alert("Please enter the Payment Reference Number from your receipt.");
      return;
    }
    setIsSubmitting(true);
    const reference = "MOC-" + Date.now();
    localStorage.setItem("pendingOrder", JSON.stringify({ reference, customer: form, items, total: finalTotal, paymentRef }));
    setTimeout(() => {
      navigate("/checkout/success");
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-16 relative">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight mb-8">Checkout</h1>
        <form onSubmit={handleProceedToQR} className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-black/50 mb-2">Contact Details</h2>
          <input required type="text" placeholder="Full Name" className="w-full border border-black/20 p-3 text-sm focus:outline-none" onChange={e => setForm({...form, name: e.target.value})} />
          <input required type="email" placeholder="Email Address" className="w-full border border-black/20 p-3 text-sm focus:outline-none" onChange={e => setForm({...form, email: e.target.value})} />
          <input required type="tel" placeholder="Phone Number" className="w-full border border-black/20 p-3 text-sm focus:outline-none" onChange={e => setForm({...form, phone: e.target.value})} />

          <h2 className="text-xs font-bold uppercase tracking-widest text-black/50 mt-8 mb-2">Delivery Address</h2>
          <input required type="text" placeholder="Street Address" className="w-full border border-black/20 p-3 text-sm focus:outline-none" onChange={e => setForm({...form, address: e.target.value})} />
          <input required type="text" placeholder="City" className="w-full border border-black/20 p-3 text-sm focus:outline-none" onChange={e => setForm({...form, city: e.target.value})} />
          
          <div className="mt-4">
            <label className="block text-[11px] font-bold uppercase tracking-widest text-black/50 mb-2">Shipping Region (J&T)</label>
            <select value={zone} onChange={e => setZone(e.target.value as ShippingZone)} className="w-full border border-black/20 p-3 text-sm bg-white focus:outline-none">
              {Object.entries(SHIPPING_ZONE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label} - ₱{calculateShipping(0, key as ShippingZone)}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="w-full bg-black text-white text-xs font-bold uppercase tracking-[0.2em] py-5 mt-8 hover:bg-black/80 transition">
            Proceed to Payment - {formatPHP(finalTotal)}
          </button>
        </form>
      </div>

      <div className="bg-[#f2efe9] p-8 h-fit">
        <h2 className="text-xs font-bold uppercase tracking-widest text-black/50 mb-6">Order Summary</h2>
        <div className="space-y-4 mb-6">
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-4">
                <img src={item.product.imageUrl} className="w-12 h-12 object-cover bg-[#e8e4df]" />
                <div>
                  <p className="font-bold uppercase tracking-widest text-xs">{item.product.name}</p>
                  <p className="text-black/50 text-xs">Size {item.size} · Qty {item.quantity}</p>
                </div>
              </div>
              <p className="font-medium">{formatPHP(item.product.pricePhp * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-black/10 pt-4 space-y-2 text-sm">
          <div className="flex justify-between text-black/60"><span>Subtotal</span><span>{formatPHP(total)}</span></div>
          <div className="flex justify-between text-black/60"><span>Shipping</span><span>{shippingFee === 0 ? "FREE" : formatPHP(shippingFee)}</span></div>
          <div className="flex justify-between font-black text-lg pt-2 border-t border-black/10 mt-2"><span>Total</span><span>{formatPHP(finalTotal)}</span></div>
        </div>
      </div>

      {showQR && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-8 text-center relative rounded-lg">
            <button onClick={() => setShowQR(false)} className="absolute top-4 right-4 text-black/50 hover:text-black font-bold">✕</button>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Scan to Pay</h2>
            <p className="text-sm text-black/60 mb-6">Select your bank/app and scan the QR code to pay exactly <strong>{formatPHP(finalTotal)}</strong>.</p>
            
            <div className="flex justify-center gap-2 mb-6">
              <button onClick={() => setPaymentMethod("gcash")} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md border ${paymentMethod === "gcash" ? "bg-blue-600 text-white border-blue-600" : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"}`}>GCash</button>
              <button onClick={() => setPaymentMethod("maya")} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md border ${paymentMethod === "maya" ? "bg-green-600 text-white border-green-600" : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"}`}>Maya</button>
              <button onClick={() => setPaymentMethod("securitybank")} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md border ${paymentMethod === "securitybank" ? "bg-red-600 text-white border-red-600" : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"}`}>Security Bank</button>
            </div>

            <div className="w-64 h-64 mx-auto bg-gray-50 border border-black/10 flex items-center justify-center mb-6 p-2 rounded-lg">
               <img src={`/${paymentMethod}-qr.png`} alt="Payment QR" className="w-full h-full object-contain" />
            </div>

            <div className="mb-4 text-left">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-black/50 mb-1">Payment Reference Number</label>
              <input 
                type="text" 
                placeholder="e.g. 0123 456 789" 
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black" 
              />
            </div>

            <button onClick={handleConfirmPayment} disabled={isSubmitting} className="w-full bg-black text-white text-xs font-bold uppercase tracking-[0.2em] py-4 hover:bg-black/80 transition rounded-lg">
              {isSubmitting ? "Saving Order..." : "I have paid - Complete Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

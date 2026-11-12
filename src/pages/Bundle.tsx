import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { formatPHP } from "../shared/catalog";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const BUNDLE_PRICE = 7500; // Match the old pricing

export default function BundlePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const reference = "BUNDLE-" + Date.now();
      localStorage.setItem("pendingBundle", JSON.stringify({ reference, customer: form }));
      
      const response = await fetch(`${API_URL}/api/bundle-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: form, reference, origin: window.location.origin }),
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
    <div className="min-h-screen bg-[#1a1a1a] text-[#faf9f7] py-20 px-6">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-[-0.03em] leading-[0.9] mb-6">
            The 50-App<br/>Bundle
          </h1>
          <p className="text-white/70 mb-8 leading-relaxed">
            The ultimate digital cash engine. 50 fully built, production-ready web applications designed to generate revenue immediately. Includes source code and deployment guides.
          </p>
          <ul className="space-y-3 mb-8 text-sm text-white/80">
            <li>✓ 50 Premium Business Applications</li>
            <li>✓ Lifetime Offline Access (No Subscriptions)</li>
            <li>✓ ISO219 Database (Sovereign)</li>
            <li>✓ Instant ZIP Delivery via Email</li>
          </ul>
          <p className="text-3xl font-black mb-8">{formatPHP(BUNDLE_PRICE)}</p>
        </div>

        <div className="bg-[#2a2a2a] p-8 border border-white/10">
          <h2 className="text-xl font-bold uppercase tracking-widest mb-6">Secure Checkout</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input required type="text" placeholder="Full Name" className="w-full bg-[#1a1a1a] border border-white/20 p-4 text-sm focus:outline-none focus:border-white/50 text-white" onChange={e => setForm({...form, name: e.target.value})} />
            <input required type="email" placeholder="Email Address (for delivery)" className="w-full bg-[#1a1a1a] border border-white/20 p-4 text-sm focus:outline-none focus:border-white/50 text-white" onChange={e => setForm({...form, email: e.target.value})} />
            <button disabled={isSubmitting} type="submit" className="w-full bg-[#faf9f7] text-[#1a1a1a] font-bold uppercase tracking-[0.2em] py-5 mt-4 hover:bg-white transition disabled:opacity-50">
              {isSubmitting ? "Redirecting..." : `Pay ${formatPHP(BUNDLE_PRICE)}`}
            </button>
            <p className="text-xs text-white/40 text-center mt-4">Secure payment via QR Ph / Maya</p>
          </form>
        </div>
      </div>
    </div>
  );
}

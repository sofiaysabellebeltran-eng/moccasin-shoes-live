import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { formatPHP } from "../shared/catalog";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const BUNDLE_PRICE = 7500;

export default function BundlePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "" });
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
      alert("Network error. Is the backend running?");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#faf9f7] py-20 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-[-0.03em] leading-[0.9] mb-6">
            The Mega<br/>Bundle
          </h1>
          <p className="text-white/70 mb-8 leading-relaxed">
            The ultimate business and lifestyle package. 5 physical pairs of Moccasin shoes and 50 fully built, production-ready digital web applications.
          </p>
          <ul className="space-y-3 mb-8 text-sm text-white/80 font-medium">
            <li>✓ 5 Physical Moccasin Shoes (Choose any 5)</li>
            <li>✓ 50 Premium Digital Apps (Source Code)</li>
            <li>✓ Instant Digital Delivery via Email</li>
            <li>✓ J&T Physical Delivery Included</li>
          </ul>
          <p className="text-4xl font-black mb-8">{formatPHP(BUNDLE_PRICE)}</p>
        </div>

        <div className="bg-[#2a2a2a] p-8 border border-white/10">
          <h2 className="text-xl font-bold uppercase tracking-widest mb-6">Secure Checkout</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input required type="text" placeholder="Full Name" className="w-full bg-[#1a1a1a] border border-white/20 p-4 text-sm focus:outline-none text-white" onChange={e => setForm({...form, name: e.target.value})} />
            <input required type="email" placeholder="Email Address" className="w-full bg-[#1a1a1a] border border-white/20 p-4 text-sm focus:outline-none text-white" onChange={e => setForm({...form, email: e.target.value})} />
            <input required type="tel" placeholder="Phone Number" className="w-full bg-[#1a1a1a] border border-white/20 p-4 text-sm focus:outline-none text-white" onChange={e => setForm({...form, phone: e.target.value})} />
            <input required type="text" placeholder="Delivery Address" className="w-full bg-[#1a1a1a] border border-white/20 p-4 text-sm focus:outline-none text-white" onChange={e => setForm({...form, address: e.target.value})} />
            <input required type="text" placeholder="City" className="w-full bg-[#1a1a1a] border border-white/20 p-4 text-sm focus:outline-none text-white" onChange={e => setForm({...form, city: e.target.value})} />
            
            <button disabled={isSubmitting} type="submit" className="w-full bg-[#faf9f7] text-[#1a1a1a] font-bold uppercase tracking-[0.2em] py-5 mt-4 hover:bg-white transition disabled:opacity-50">
              {isSubmitting ? "Redirecting..." : `Pay ${formatPHP(BUNDLE_PRICE)}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

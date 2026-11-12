import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const API_URL = import.meta.env.VITE_API_URL || "https://moccasin-api.onrender.com";

export default function SuccessPage() {
  const { clearCart } = useCart();
  const [status, setStatus] = useState("⏳ Finalizing your order...");
  const navigate = useNavigate();

  useEffect(() => {
    const saveOrder = async () => {
      const pendingShoe = localStorage.getItem("pendingOrder");
      const pendingBundle = localStorage.getItem("pendingBundle");

      let payload = null;
      if (pendingShoe) payload = JSON.parse(pendingShoe);
      else if (pendingBundle) payload = JSON.parse(pendingBundle);

      if (!payload) { setStatus("❌ No pending order found."); return; }

      try {
        const res = await fetch(`${API_URL}/api/manual-save`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          setStatus("✅ Order Confirmed! Check your email.");
          localStorage.removeItem("pendingOrder");
          localStorage.removeItem("pendingBundle");
          clearCart();
          setTimeout(() => navigate("/"), 3000);
        } else {
          setStatus("❌ Error saving order.");
        }
      } catch (err) {
        setStatus("❌ Network error.");
      }
    };
    saveOrder();
  }, [clearCart, navigate]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
      </div>
      <h1 className="text-4xl font-black uppercase tracking-tight mb-4">Order Confirmed!</h1>
      <p className="text-xl font-bold text-green-600 mb-8">{status}</p>
      <Link to="/" className="text-sm underline mt-4 hover:text-black/50">Return to Store</Link>
    </div>
  );
}

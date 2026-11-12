import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function SuccessPage() {
  const { clearCart } = useCart();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSave = async () => {
    const pending = localStorage.getItem("pendingOrder");
    if (!pending) { setMessage("❌ No pending order found."); return; }

    setSaving(true);
    setMessage("⏳ Connecting to backend...");

    try {
      const orderData = JSON.parse(pending);
      // USING 127.0.0.1 TO FIX WINDOWS IPV6 ISSUES
      const res = await fetch("${import.meta.env.VITE_API_URL || "http://127.0.0.1:3001"}/api/manual-save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessage("✅ Order saved! Check the backend terminal for email status.");
        localStorage.removeItem("pendingOrder");
        clearCart();
        setTimeout(() => navigate("/admin"), 2000);
      } else {
        setMessage("❌ Error: " + data.error);
      }
    } catch (err) {
      setMessage("❌ Network error. Backend is not responding.");
    }
    setSaving(false);
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
      </div>
      <h1 className="text-4xl font-black uppercase tracking-tight mb-4">Order Confirmed!</h1>
      <p className="text-black/60 mb-8 max-w-md">Click the button below to finalize your order and receive your email receipt.</p>
      
      <button onClick={handleSave} disabled={saving} className="bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-black/80 disabled:opacity-50 mb-4">
        {saving ? "Processing..." : "Complete Order & Send Email"}
      </button>

      {message && <p className="font-bold text-sm text-black/70 mb-4">{message}</p>}
      <Link to="/" className="text-sm underline mt-4 hover:text-black/50">Return to Store</Link>
    </div>
  );
}


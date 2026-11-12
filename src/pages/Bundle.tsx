import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatPHP, PRODUCT_CATALOG, type StoreProduct } from "../shared/catalog";

const BUNDLE_PRICE = 7500;

type SelectedShoe = { product: StoreProduct; size: string; quantity: number };

export default function BundlePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "" });
  
  const [selectedShoes, setSelectedShoes] = useState<SelectedShoe[]>([]);
  const [activeSize, setActiveSize] = useState<Record<string, string>>({});
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("gcash");
  const [paymentRef, setPaymentRef] = useState("");

  const totalSelected = selectedShoes.reduce((sum, s) => sum + s.quantity, 0);

  const updateQuantity = (product: StoreProduct, delta: number) => {
    setSelectedShoes(prev => {
      const existing = prev.find(s => s.product.id === product.id);
      const currentTotal = prev.reduce((sum, s) => sum + s.quantity, 0);

      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty === 0) return prev.filter(s => s.product.id !== product.id);
        if (delta > 0 && currentTotal >= 5) {
          alert("You can only select 5 shoes for the Mega Bundle.");
          return prev;
        }
        return prev.map(s => s.product.id === product.id ? { ...s, quantity: newQty } : s);
      } else {
        if (delta > 0) {
          if (currentTotal >= 5) {
            alert("You can only select 5 shoes for the Mega Bundle.");
            return prev;
          }
          const size = activeSize[product.id] || product.availableSizes[0];
          return [...prev, { product, size, quantity: 1 }];
        }
        return prev;
      }
    });
  };

  const updateSize = (productId: string, newSize: string) => {
    setActiveSize({ ...activeSize, [productId]: newSize });
    setSelectedShoes(selectedShoes.map(s => s.product.id === productId ? { ...s, size: newSize } : s));
  };

  const handleProceedToQR = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalSelected !== 5) {
      alert("Please select exactly 5 shoes to complete the Mega Bundle.");
      return;
    }
    setShowQR(true);
  };

  const handleConfirmPayment = () => {
    if (!paymentRef.trim()) {
      alert("Please enter the Payment Reference Number from your receipt.");
      return;
    }
    setIsSubmitting(true);
    const reference = "BUNDLE-" + Date.now();
    
    const itemsPayload = selectedShoes.map(s => ({
      name: s.product.name,
      size: s.size,
      quantity: s.quantity,
      pricePhp: s.product.pricePhp
    }));

    // Force total to be exactly 7500
    localStorage.setItem("pendingBundle", JSON.stringify({ 
      reference, 
      customer: form, 
      items: itemsPayload, 
      total: BUNDLE_PRICE, 
      paymentRef 
    }));

    setTimeout(() => {
      navigate("/checkout/success");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#faf9f7] py-16 px-6 relative">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-[-0.03em] leading-[0.9] mb-6">The Mega Bundle</h1>
          <p className="text-white/70 max-w-2xl mx-auto mb-8 leading-relaxed">
            Select your 5 physical Moccasin shoes below. Upon checkout, you will also receive instant access to the 50-App Digital Bundle via email.
          </p>
          <div className="inline-block bg-[#2a2a2a] border border-white/10 px-8 py-4 rounded-lg">
            <span className="text-2xl font-black">{formatPHP(BUNDLE_PRICE)}</span>
            <span className="text-white/50 text-sm ml-2">Total (Free Shipping Included)</span>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex justify-between items-end mb-6 border-b border-white/10 pb-4">
            <h2 className="text-2xl font-bold uppercase tracking-widest">Step 1: Choose Your 5 Shoes</h2>
            <span className={`font-bold ${totalSelected === 5 ? 'text-green-400' : 'text-yellow-400'}`}>{totalSelected} / 5 Selected</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {PRODUCT_CATALOG.map(product => {
              const selectedItem = selectedShoes.find(s => s.product.id === product.id);
              return (
                <div key={product.id} className={`border ${selectedItem ? 'border-green-500 bg-white/10' : 'border-white/10 bg-[#2a2a2a]'} p-3 rounded-sm transition`}>
                  <div className="aspect-square bg-[#e8e4df] mb-3 relative">
                    <img src={product.imageUrl} className="w-full h-full object-cover" />
                    {selectedItem && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg">{selectedItem.quantity}</div>
                    )}
                  </div>
                  <h3 className="text-xs font-bold uppercase truncate">{product.name}</h3>
                  <p className="text-[10px] text-white/50 mb-3">{product.series}</p>
                  
                  {selectedItem ? (
                    <div className="space-y-2">
                      <select value={selectedItem.size} onChange={(e) => updateSize(product.id, e.target.value)} className="w-full bg-[#1a1a1a] border border-white/20 text-xs p-2 text-white outline-none">
                        {product.availableSizes.map(sz => <option key={sz} value={sz}>Size {sz}</option>)}
                      </select>
                      <div className="flex items-center justify-between border border-white/20 rounded">
                        <button type="button" onClick={() => updateQuantity(product, -1)} className="px-3 py-1 hover:bg-white/10 text-white">-</button>
                        <span className="text-xs font-bold">{selectedItem.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(product, 1)} className="px-3 py-1 hover:bg-white/10 text-white">+</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => updateQuantity(product, 1)} className="w-full border border-white/20 text-xs py-2 hover:bg-white/10 transition">Add to Bundle</button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className={`transition-opacity duration-500 ${totalSelected === 5 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          <div className="flex justify-between items-end mb-6 border-b border-white/10 pb-4">
            <h2 className="text-2xl font-bold uppercase tracking-widest">Step 2: Shipping Details</h2>
          </div>
          
          <form onSubmit={handleProceedToQR} className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <input required type="text" placeholder="Full Name" className="w-full bg-[#2a2a2a] border border-white/20 p-4 text-sm focus:outline-none text-white" onChange={e => setForm({...form, name: e.target.value})} />
              <input required type="email" placeholder="Email Address (for digital apps)" className="w-full bg-[#2a2a2a] border border-white/20 p-4 text-sm focus:outline-none text-white" onChange={e => setForm({...form, email: e.target.value})} />
              <input required type="tel" placeholder="Phone Number" className="w-full bg-[#2a2a2a] border border-white/20 p-4 text-sm focus:outline-none text-white" onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
            <div className="space-y-4">
              <input required type="text" placeholder="Delivery Address" className="w-full bg-[#2a2a2a] border border-white/20 p-4 text-sm focus:outline-none text-white" onChange={e => setForm({...form, address: e.target.value})} />
              <input required type="text" placeholder="City" className="w-full bg-[#2a2a2a] border border-white/20 p-4 text-sm focus:outline-none text-white" onChange={e => setForm({...form, city: e.target.value})} />
              <button type="submit" className="w-full bg-[#faf9f7] text-[#1a1a1a] font-bold uppercase tracking-[0.2em] py-5 hover:bg-white transition mt-2">
                Proceed to Payment - {formatPHP(BUNDLE_PRICE)}
              </button>
            </div>
          </form>
        </div>

      </div>

      {showQR && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-[#1a1a1a] max-w-md w-full p-8 text-center relative rounded-lg">
            <button onClick={() => setShowQR(false)} className="absolute top-4 right-4 text-black/50 hover:text-black font-bold">✕</button>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Scan to Pay</h2>
            <p className="text-sm text-black/60 mb-6">Select your bank/app and scan the QR code to pay exactly <strong>{formatPHP(BUNDLE_PRICE)}</strong>.</p>
            
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
              <input type="text" placeholder="e.g. 0123 456 789" value={paymentRef} onChange={(e) => setPaymentRef(e.target.value)} className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black text-black" />
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

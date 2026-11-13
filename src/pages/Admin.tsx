import { useState, useEffect } from "react";
import { formatPHP } from "../shared/catalog";

export default function AdminPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleShip = async (order: any) => {
    await fetch(`${API_URL}/api/admin/ship`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: order.id, email: order.email, reference: order.reference })
    });
    fetchOrders();
    alert(`Tracking sent to ${order.email}!`);
  };

  const totalSales = orders.filter(o => o.status === "Paid").reduce((sum, o) => sum + o.total, 0);

  if (loading) return <div className="p-20 text-center font-bold">Loading Admin Data...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Owner Dashboard</h1>
          <p className="text-black/50 text-sm mt-1">Manage orders and fulfillment</p>
        </div>
        <div className="bg-[#f2efe9] px-6 py-4 rounded-lg text-right">
          <p className="text-xs font-bold uppercase tracking-widest text-black/50">Total Paid Sales</p>
          <p className="text-2xl font-black">{formatPHP(totalSales)}</p>
        </div>
      </div>

      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="p-8 text-center text-black/50 border border-black/10 rounded-lg">No orders yet.</div>
        ) : orders.map((order) => {
          // Ensure items are parsed correctly
          let items = [];
          try {
            items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
          } catch (e) {
            items = [];
          }
          
          const isBundle = order.reference.startsWith("BUNDLE-");

          return (
            <div key={order.id} className="border border-black/10 rounded-lg bg-white overflow-hidden shadow-sm">
              {/* Header */}
              <div className="bg-[#faf9f7] p-4 flex flex-wrap justify-between items-center border-b border-black/10">
                <div>
                  <p className="font-black text-sm text-black/80">REF: {order.reference}</p>
                  <p className="text-xs text-black/50">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-lg">{formatPHP(order.total)}</p>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${order.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 grid md:grid-cols-2 gap-8">
                {/* Left Side: Customer & Shipping */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-black/50 mb-3 border-b border-black/10 pb-1">Customer & Shipping Info</h4>
                  <div className="space-y-2 text-sm text-black/80">
                    <p><strong>Name:</strong> {order.customer_name}</p>
                    <p><strong>Phone:</strong> {order.phone}</p>
                    <p><strong>Email:</strong> {order.email}</p>
                    <div className="bg-[#faf9f7] p-3 rounded border border-black/5 mt-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1">Ship To:</p>
                      <p className="font-medium">{order.address}</p>
                      <p>{order.city}</p>
                    </div>
                  </div>
                </div>

                {/* Right Side: Items Ordered */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-black/50 mb-3 border-b border-black/10 pb-1">Items to Pack</h4>
                  <ul className="space-y-3">
                    {items.map((item: any, idx: number) => (
                      <li key={idx} className="flex justify-between items-center bg-[#faf9f7] p-3 rounded border border-black/5">
                        <div>
                          <p className="font-bold text-sm uppercase">{item.name || item.product?.name || "Item"}</p>
                          {item.size && <p className="text-xs text-black/60 font-bold mt-1">Size: {item.size}</p>}
                        </div>
                        <p className="font-black text-sm">x{item.quantity}</p>
                      </li>
                    ))}
                  </ul>
                  {isBundle && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded text-blue-800 text-xs font-bold">
                      Note: This is a Digital Bundle order. Drive link has been sent automatically.
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              {order.status === "Paid" && (
                <div className="bg-[#faf9f7] p-4 border-t border-black/10 flex justify-end">
                  <button onClick={() => handleShip(order)} className="bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black/80 transition">
                    Mark as Shipped & Send Email
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

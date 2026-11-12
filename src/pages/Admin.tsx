import { useState, useEffect } from "react";
import { formatPHP } from "../shared/catalog";

const ADMIN_PASSWORD = "moccasin2026";
const API_URL = import.meta.env.VITE_API_URL || "https://moccasin-api.onrender.com";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("adminAuth") === "true") setIsAuthenticated(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("adminAuth", "true");
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

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

  useEffect(() => { if (isAuthenticated) fetchOrders(); }, [isAuthenticated]);

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6">
        <div className="bg-white p-8 border border-black/10 rounded-lg shadow-sm max-w-sm w-full">
          <h1 className="text-2xl font-black uppercase tracking-tight mb-6 text-center">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" placeholder="Enter Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black" />
            {error && <p className="text-red-500 text-xs font-bold text-center">Incorrect password</p>}
            <button type="submit" className="w-full bg-black text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black/80 transition">Unlock Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) return <div className="p-20 text-center font-bold">Loading Admin Data...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Owner Dashboard</h1>
          <p className="text-black/50 text-sm mt-1">Manage orders, payment references, and fulfillment</p>
        </div>
        <div className="bg-[#f2efe9] px-6 py-4 rounded-lg text-right">
          <p className="text-xs font-bold uppercase tracking-widest text-black/50">Total Paid Sales</p>
          <p className="text-2xl font-black">{formatPHP(totalSales)}</p>
        </div>
      </div>

      <div className="bg-white border border-black/10 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#faf9f7] border-b border-black/10">
            <tr>
              <th className="p-4 font-bold uppercase tracking-widest text-[11px] text-black/50">Date & Time</th>
              <th className="p-4 font-bold uppercase tracking-widest text-[11px] text-black/50">Customer & Items</th>
              <th className="p-4 font-bold uppercase tracking-widest text-[11px] text-black/50">Total</th>
              <th className="p-4 font-bold uppercase tracking-widest text-[11px] text-black/50">Payment Ref</th>
              <th className="p-4 font-bold uppercase tracking-widest text-[11px] text-black/50">Status</th>
              <th className="p-4 font-bold uppercase tracking-widest text-[11px] text-black/50 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-black/50">No orders yet.</td></tr>
            ) : orders.map((order) => {
              let parsedItems = [];
              try { parsedItems = JSON.parse(order.items); } catch(e) {}
              
              return (
              <tr key={order.id} className="border-b border-black/5 hover:bg-black/5">
                <td className="p-4 text-xs whitespace-nowrap">
                  <p className="font-bold">{new Date(order.created_at).toLocaleDateString()}</p>
                  <p className="text-black/50">{new Date(order.created_at).toLocaleTimeString()}</p>
                  <p className="text-[10px] text-black/40 mt-1">{order.reference}</p>
                </td>
                <td className="p-4">
                  <p className="font-bold">{order.customer_name}</p>
                  <p className="text-xs text-black/50 mb-2">{order.city}</p>
                  <div className="bg-gray-50 border border-gray-100 p-2 rounded text-xs">
                    <p className="font-bold text-[10px] uppercase text-gray-400 mb-1">Items:</p>
                    {parsedItems.map((item: any, i: number) => (
                      <div key={i} className="text-gray-700">• {item.name} {item.size ? `(Size ${item.size})` : ''} x{item.quantity}</div>
                    ))}
                  </div>
                </td>
                <td className="p-4 font-medium whitespace-nowrap">{formatPHP(order.total)}</td>
                <td className="p-4 font-mono text-xs bg-yellow-50 font-bold">{order.paymentRef || "N/A"}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${order.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {order.status === "Paid" && (
                    <button onClick={() => handleShip(order)} className="bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-black/80 whitespace-nowrap">Ship</button>
                  )}
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
}

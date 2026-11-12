import { useState, useEffect } from "react";
import { formatPHP } from "../shared/catalog";

export default function AdminPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/admin/orders");
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
    await fetch("http://localhost:3001/api/admin/ship", {
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

      <div className="bg-white border border-black/10 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#faf9f7] border-b border-black/10">
            <tr>
              <th className="p-4 font-bold uppercase tracking-widest text-xs text-black/50">Ref / Date</th>
              <th className="p-4 font-bold uppercase tracking-widest text-xs text-black/50">Customer</th>
              <th className="p-4 font-bold uppercase tracking-widest text-xs text-black/50">Total</th>
              <th className="p-4 font-bold uppercase tracking-widest text-xs text-black/50">Status</th>
              <th className="p-4 font-bold uppercase tracking-widest text-xs text-black/50 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-black/50">No orders yet. Test a checkout with the Webhook configured!</td></tr>
            ) : orders.map((order) => (
              <tr key={order.id} className="border-b border-black/5 hover:bg-black/5">
                <td className="p-4">
                  <p className="font-bold">{order.reference}</p>
                  <p className="text-xs text-black/50">{new Date(order.created_at).toLocaleDateString()}</p>
                </td>
                <td className="p-4">
                  <p className="font-bold">{order.customer_name}</p>
                  <p className="text-xs text-black/50">{order.city}</p>
                </td>
                <td className="p-4 font-medium">{formatPHP(order.total)}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${order.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {order.status === "Paid" && (
                    <button onClick={() => handleShip(order)} className="bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-black/80">
                      Ship
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

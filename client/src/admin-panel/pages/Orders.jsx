import { useEffect, useState } from "react";
import { apiClient } from "../api/apiClient";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiClient.getOrders();

      setOrders(data.orders || []);
    } catch (err) {
      console.error("Orders error:", err);
      setError("Orders load nahi ho rahe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-slate-500 mt-2">
          MongoDB se customer orders
        </p>
      </div>

      {loading && (
        <div className="bg-white rounded-xl border p-6">
          Loading orders...
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 rounded-xl border border-red-200 p-4">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="p-4 border-b">
            <strong>Total Orders: {orders.length}</strong>
          </div>

          {orders.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              Abhi koi order nahi mila.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-4">Order ID</th>
                    <th className="text-left p-4">Customer</th>
                    <th className="text-left p-4">Items</th>
                    <th className="text-left p-4">Total</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-t">
                      <td className="p-4 font-mono text-sm">
                        {order.id.slice(0, 8)}...
                      </td>

                      <td className="p-4">
                        {order.shippingAddress?.fullName || "—"}
                      </td>

                      <td className="p-4">
                        {order.items?.reduce(
                          (total, item) => total + item.quantity,
                          0
                        ) || 0}
                      </td>

                      <td className="p-4 font-semibold">
                        ${order.total ?? 0}
                      </td>

                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                          {order.status || "placed"}
                        </span>
                      </td>

                      <td className="p-4 text-slate-500">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
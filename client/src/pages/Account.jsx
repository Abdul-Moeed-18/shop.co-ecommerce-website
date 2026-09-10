import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/orders")
      .then((r) => setOrders(r.data.orders))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="container-page py-8">
      <h1 className="font-display font-bold text-3xl uppercase">My Account</h1>

      <div className="mt-6 grid lg:grid-cols-[280px_1fr] gap-8 items-start">
        <div className="rounded-2xl border border-line p-5">
          <p className="font-display font-semibold">{user.name}</p>
          <p className="text-sm text-graytext">{user.email}</p>
          <button onClick={handleLogout} className="btn-outline w-full mt-5">
            Log Out
          </button>
        </div>

        <div>
          <h2 className="font-display font-semibold text-lg">Order History</h2>

          {loading && <p className="text-graytext mt-4 text-sm">Loading orders...</p>}

          {!loading && orders.length === 0 && (
            <div className="mt-4 rounded-2xl border border-line p-8 text-center">
              <Package className="mx-auto text-graytext" size={28} />
              <p className="text-graytext mt-3">You haven't placed any orders yet.</p>
              <Link to="/shop" className="btn-primary mt-4 inline-flex">
                Start Shopping
              </Link>
            </div>
          )}

          <ul className="mt-4 space-y-4">
            {orders.map((order) => (
              <li key={order.id} className="rounded-2xl border border-line p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm text-graytext">Order ID</p>
                    <p className="font-mono text-sm">{order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-graytext">{new Date(order.createdAt).toLocaleDateString()}</p>
                    <p className="font-display font-semibold">${order.total.toFixed(2)}</p>
                  </div>
                </div>
                <p className="text-sm text-graytext mt-2">
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""} · Status: {order.status}
                </p>
                <Link to={`/order-confirmation/${order.id}`} className="text-sm underline font-medium mt-2 inline-block">
                  View details
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

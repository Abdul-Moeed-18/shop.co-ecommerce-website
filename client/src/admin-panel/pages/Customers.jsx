import { useEffect, useState } from "react";
import { apiClient } from "../api/apiClient";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiClient.getCustomers();

      setCustomers(data.customers || []);
    } catch (err) {
      console.error("Customers error:", err);
      setError("Customers load nahi ho rahe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-slate-500 mt-2">
          MongoDB se registered customers
        </p>
      </div>

      {loading && (
        <div className="bg-white rounded-xl border p-6">
          Loading customers...
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
            <strong>Total Customers: {customers.length}</strong>
          </div>

          {customers.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              Abhi koi customer nahi mila.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-4">Name</th>
                    <th className="text-left p-4">Email</th>
                    <th className="text-left p-4">Registered</th>
                  </tr>
                </thead>

                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-t">
                      <td className="p-4 font-medium">
                        {customer.name}
                      </td>

                      <td className="p-4 text-slate-600">
                        {customer.email}
                      </td>

                      <td className="p-4 text-slate-500">
                        {customer.createdAt
                          ? new Date(customer.createdAt).toLocaleDateString()
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
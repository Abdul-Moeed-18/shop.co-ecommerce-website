import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../api/apiClient";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiClient.getProducts();
      setProducts(data.products || []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await apiClient.deleteProduct(id);
      setProducts((items) => items.filter((item) => item.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-500 mt-1">Manage products stored in MongoDB.</p>
        </div>
        <Link to="/admin/products/new" className="bg-slate-900 text-white px-4 py-3 rounded-xl font-semibold">Add product</Link>
      </div>

      {error && <div className="bg-red-50 text-red-700 rounded-xl px-4 py-3">{error}</div>}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        {loading ? <div className="p-8 text-slate-500">Loading products...</div> : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50"><tr>
              <th className="text-left px-5 py-4">Product</th><th className="text-left px-5 py-4">Category</th><th className="text-left px-5 py-4">Price</th><th className="text-left px-5 py-4">New</th><th className="text-left px-5 py-4">Actions</th>
            </tr></thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-slate-100">
                  <td className="px-5 py-4 font-semibold">{product.name}</td>
                  <td className="px-5 py-4 text-slate-600">{product.category}</td>
                  <td className="px-5 py-4">${Number(product.price).toFixed(2)}</td>
                  <td className="px-5 py-4">{product.isNew ? "Yes" : "No"}</td>
                  <td className="px-5 py-4"><div className="flex gap-3">
                    <Link className="font-semibold" to={`/admin/products/${product.id}/edit`}>Edit</Link>
                    <button className="font-semibold text-red-600" onClick={() => remove(product.id)}>Delete</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

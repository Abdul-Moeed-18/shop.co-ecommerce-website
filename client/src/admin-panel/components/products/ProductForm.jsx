import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../../api/apiClient";

const empty = {
  name: "", category: "", dressStyle: "Casual", price: "", originalPrice: "", discount: "0",
  rating: "0", reviewCount: "0", description: "", image: "", isNew: false,
  sizes: "", colors: "",
};

function toForm(product) {
  return {
    name: product.name || "", category: product.category || "", dressStyle: product.dressStyle || "Casual",
    price: product.price ?? "", originalPrice: product.originalPrice ?? "", discount: product.discount ?? "0",
    rating: product.rating ?? "0", reviewCount: product.reviewCount ?? "0", description: product.description || "",
    image: product.image || "", isNew: Boolean(product.isNew), sizes: (product.sizes || []).join(", "),
    colors: (product.colors || []).map((c) => `${c.name}:${c.hex}`).join(", "),
  };
}

function toPayload(form) {
  const colors = form.colors.split(",").map((x) => x.trim()).filter(Boolean).map((x) => {
    const [name, hex] = x.split(":");
    return { name: name?.trim() || "Color", hex: hex?.trim() || "#000000" };
  });
  return {
    ...form,
    price: Number(form.price), originalPrice: form.originalPrice === "" ? null : Number(form.originalPrice),
    discount: Number(form.discount || 0), rating: Number(form.rating || 0), reviewCount: Number(form.reviewCount || 0),
    sizes: form.sizes.split(",").map((x) => x.trim()).filter(Boolean), colors,
  };
}

export default function ProductForm({ mode = "create" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode !== "edit") return;
    apiClient.getProduct(id).then((product) => setForm(toForm(product))).catch((err) => setError(err.response?.data?.error || "Failed to load product.")).finally(() => setLoading(false));
  }, [id, mode]);

  const change = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const submit = async (e) => {
    e.preventDefault(); setError(""); setSaving(true);
    try {
      if (!form.name || !form.category || !form.dressStyle || form.price === "") throw new Error("Name, category, dress style and price are required.");
      if (mode === "edit") await apiClient.updateProduct(id, toPayload(form));
      else await apiClient.createProduct(toPayload(form));
      navigate("/admin/products");
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to save product.");
    } finally { setSaving(false); }
  };

  if (loading) return <div className="p-8">Loading product...</div>;

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Catalog</p><h1 className="text-2xl font-bold">{mode === "edit" ? "Edit product" : "Add product"}</h1></div></div>
      {error && <div className="bg-red-50 text-red-700 rounded-xl px-4 py-3">{error}</div>}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          ["name","Product name","text"],["category","Category","text"],["dressStyle","Dress style","text"],["price","Price","number"],["originalPrice","Original price","number"],["discount","Discount","number"],["rating","Rating","number"],["reviewCount","Review count","number"],["image","Image path","text"],["sizes","Sizes (comma separated)","text"],["colors","Colors name:hex (comma separated)","text"],
        ].map(([name,label,type]) => <label key={name} className="block"><span className="block text-sm font-semibold text-slate-700 mb-2">{label}</span><input name={name} type={type} value={form[name]} onChange={change} className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none" /></label>)}
        <label className="md:col-span-2"><span className="block text-sm font-semibold text-slate-700 mb-2">Description</span><textarea name="description" value={form.description} onChange={change} rows="5" className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none" /></label>
        <label className="flex items-center gap-3"><input type="checkbox" name="isNew" checked={form.isNew} onChange={change} /><span className="font-semibold">Mark as new</span></label>
      </div>
      <div className="flex justify-end gap-3"><button type="button" onClick={() => navigate("/admin/products")} className="px-4 py-3 rounded-xl bg-slate-100 font-semibold">Cancel</button><button disabled={saving} className="px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold disabled:opacity-60">{saving ? "Saving..." : mode === "edit" ? "Update product" : "Save product"}</button></div>
    </form>
  );
}

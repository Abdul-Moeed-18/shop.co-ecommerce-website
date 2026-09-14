import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function Login() {
  const { user, login, loading } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to={location.state?.from || "/admin"} replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate(location.state?.from || "/admin", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen grid place-items-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-md rounded-2xl shadow-sm border p-8">
        <h1 className="text-2xl font-bold text-slate-900">SHOP.CO Admin</h1>
        <p className="text-slate-500 mt-2">Sign in to manage your store.</p>

        {error && <div className="mt-5 rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm">{error}</div>}

        <label className="block mt-6 text-sm font-semibold text-slate-700">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full mt-2 px-4 py-3 border rounded-xl outline-none" placeholder="admin@example.com" />

        <label className="block mt-4 text-sm font-semibold text-slate-700">Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full mt-2 px-4 py-3 border rounded-xl outline-none" placeholder="••••••••" />

        <button disabled={submitting} className="w-full mt-6 bg-slate-900 disabled:opacity-60 text-white py-3 rounded-xl font-semibold">
          {submitting ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

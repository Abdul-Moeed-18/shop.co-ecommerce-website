import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (!form.password) next.password = "Password is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      await login(form);
      navigate(location.state?.from?.pathname || "/account");
    } catch (err) {
      setServerError(err.response?.data?.error || "Couldn't sign you in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-page py-16 max-w-md">
      <h1 className="font-display font-bold text-3xl uppercase">Log In</h1>
      <p className="text-graytext mt-2 text-sm">Welcome back. Enter your details to continue.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
        <div>
          <label className="text-sm text-graytext" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="input-field mt-1"
            autoComplete="email"
          />
          {errors.email && <p className="text-xs text-sale mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="text-sm text-graytext" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="input-field mt-1"
            autoComplete="current-password"
          />
          {errors.password && <p className="text-xs text-sale mt-1">{errors.password}</p>}
        </div>

        {serverError && <p className="text-sm text-sale">{serverError}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? "Signing In..." : "Log In"}
        </button>
      </form>

      <p className="text-sm text-graytext mt-6">
        Don't have an account?{" "}
        <Link to="/register" className="text-black underline font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
}

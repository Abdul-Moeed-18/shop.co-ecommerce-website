import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (form.password.length < 6) next.password = "Password must be at least 6 characters.";
    if (form.confirmPassword !== form.password) next.confirmPassword = "Passwords don't match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      await register(form);
      navigate("/account");
    } catch (err) {
      setServerError(err.response?.data?.error || "Couldn't create your account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-page py-16 max-w-md">
      <h1 className="font-display font-bold text-3xl uppercase">Sign Up</h1>
      <p className="text-graytext mt-2 text-sm">Create an account and get 20% off your first order.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
        <div>
          <label className="text-sm text-graytext" htmlFor="name">Full Name</label>
          <input
            id="name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="input-field mt-1"
            autoComplete="name"
          />
          {errors.name && <p className="text-xs text-sale mt-1">{errors.name}</p>}
        </div>
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
            autoComplete="new-password"
          />
          {errors.password && <p className="text-xs text-sale mt-1">{errors.password}</p>}
        </div>
        <div>
          <label className="text-sm text-graytext" htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
            className="input-field mt-1"
            autoComplete="new-password"
          />
          {errors.confirmPassword && <p className="text-xs text-sale mt-1">{errors.confirmPassword}</p>}
        </div>

        {serverError && <p className="text-sm text-sale">{serverError}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <p className="text-sm text-graytext mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-black underline font-medium">
          Log in
        </Link>
      </p>
    </div>
  );
}

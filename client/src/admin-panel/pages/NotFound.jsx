import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-slate-500 mt-3">Page not found.</p>

      <Link
        to="/admin"
        className="mt-6 bg-slate-900 text-white px-5 py-3 rounded-xl"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
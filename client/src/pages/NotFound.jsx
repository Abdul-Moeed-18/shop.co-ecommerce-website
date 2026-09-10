import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container-page py-32 text-center">
      <h1 className="font-display font-black text-6xl">404</h1>
      <p className="text-graytext mt-4">We couldn't find the page you're looking for.</p>
      <Link to="/" className="btn-primary mt-8 inline-flex">
        Back to Home
      </Link>
    </div>
  );
}

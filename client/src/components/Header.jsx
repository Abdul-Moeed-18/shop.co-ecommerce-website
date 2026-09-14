import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const NAV_LINKS = [
  { label: "Shop", to: "/shop" },
  { label: "On Sale", to: "/shop?onSale=true" },
  { label: "New Arrivals", to: "/shop?isNew=true" },
  { label: "Brands", to: "/shop" },
];

export default function Header() {
  const [bannerOpen, setBannerOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { itemCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const onSearch = (e) => {
    e.preventDefault();
    navigate(`/shop${search ? `?search=${encodeURIComponent(search)}` : ""}`);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white">
      {bannerOpen && (
        <div className="relative bg-black text-white text-center text-xs sm:text-sm py-2.5 px-10 sm:px-8">
          <p>
            Sign up and get 20% off your first order.{" "}
            <Link to="/register" className="underline font-medium">
              Sign Up Now
            </Link>
          </p>
          <button
            aria-label="Dismiss announcement"
            onClick={() => setBannerOpen(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="border-b border-line">
        <div className="container-page flex items-center gap-2 sm:gap-4 py-4">
          <button
            className="lg:hidden shrink-0"
            aria-label="Open menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link to="/" className="font-display text-xl sm:text-2xl font-black tracking-tight shrink-0">
            SHOP.CO
          </Link>

          <nav className="hidden lg:flex items-center gap-6 ml-4">
            {NAV_LINKS.map((link) => (
              <Link key={link.label} to={link.to} className="text-sm font-medium hover:text-graytext">
                {link.label}
              </Link>
            ))}
          </nav>

          <form onSubmit={onSearch} className="hidden md:flex flex-1 max-w-md ml-4">
            <div className="relative w-full">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-graytext" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for products..."
                className="input-field pl-11"
              />
            </div>
          </form>

          <div className="flex items-center gap-3 sm:gap-4 ml-auto shrink-0">
            {/* Cart */}
            <Link to="/cart" className="relative" aria-label="Cart">
              <ShoppingCart size={22} className="sm:hidden" />
              <ShoppingCart size={24} className="hidden sm:block" />

              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-medium text-white">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Admin */}
            <Link
              to="/admin"
              className="inline-flex items-center justify-center rounded-full bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-gray-800 hover:scale-105 hover:shadow-md active:scale-95"
            >
              <Link
                to={user ? "/account" : "/login"}
                aria-label="Account"
              >
                Admin
              </Link>
              {/* Account */}

              <User size={22} className="sm:hidden" />
              <User size={24} className="hidden sm:block" />
            </Link>
          </div>
        </div>

        <form onSubmit={onSearch} className="md:hidden container-page pb-4">
          <div className="relative w-full">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-graytext" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for products..."
              className="input-field pl-11"
            />
          </div>
        </form>

        {menuOpen && (
          <nav className="lg:hidden container-page pb-4 flex flex-col gap-3 border-t border-line pt-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}

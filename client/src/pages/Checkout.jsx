import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Breadcrumbs from "../components/Breadcrumbs";
import api from "../api/client";
import ClothingIllustration from "../components/ClothingIllustration";
import ProductImage from "../components/ProductImage";
import { getColorHex } from "../utils/colors";

const DELIVERY_FEE = 15;

const EMPTY_FORM = { fullName: "", phone: "", address: "", city: "", postalCode: "" };

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({ ...EMPTY_FORM, fullName: user?.name || "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const couponCode = location.state?.couponCode;
  const discountPercent = couponCode ? (couponCode === "SHOPCO20" ? 20 : couponCode === "WELCOME10" ? 10 : 0) : 0;
  const discountAmount = Math.round(((subtotal * discountPercent) / 100) * 100) / 100;
  const total = Math.max(0, subtotal - discountAmount + DELIVERY_FEE);

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!/^[0-9+()\-\s]{7,}$/.test(form.phone)) next.phone = "Enter a valid phone number.";
    if (!form.address.trim()) next.address = "Address is required.";
    if (!form.city.trim()) next.city = "City is required.";
    if (!form.postalCode.trim()) next.postalCode = "Postal code is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const { data } = await api.post("/orders", { shippingAddress: form, couponCode });
      await clearCart();
      navigate(`/order-confirmation/${data.order.id}`);
    } catch (err) {
      setServerError(err.response?.data?.error || "Couldn't place your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <p className="text-graytext">Your cart is empty.</p>
        <Link to="/shop" className="btn-primary mt-6 inline-flex">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Cart", to: "/cart" }, { label: "Checkout" }]} />
      <h1 className="font-display font-bold text-3xl uppercase mt-4">Checkout</h1>

      <div className="mt-8 grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-line p-6 space-y-4">
          <h2 className="font-display font-semibold text-lg">Shipping Details</h2>

          <div>
            <label className="text-sm text-graytext" htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              value={form.fullName}
              onChange={handleChange("fullName")}
              className="input-field mt-1"
              autoComplete="name"
            />
            {errors.fullName && <p className="text-xs text-sale mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="text-sm text-graytext" htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              value={form.phone}
              onChange={handleChange("phone")}
              className="input-field mt-1"
              autoComplete="tel"
            />
            {errors.phone && <p className="text-xs text-sale mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="text-sm text-graytext" htmlFor="address">Address</label>
            <input
              id="address"
              value={form.address}
              onChange={handleChange("address")}
              className="input-field mt-1"
              autoComplete="street-address"
            />
            {errors.address && <p className="text-xs text-sale mt-1">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-graytext" htmlFor="city">City</label>
              <input
                id="city"
                value={form.city}
                onChange={handleChange("city")}
                className="input-field mt-1"
                autoComplete="address-level2"
              />
              {errors.city && <p className="text-xs text-sale mt-1">{errors.city}</p>}
            </div>
            <div>
              <label className="text-sm text-graytext" htmlFor="postalCode">Postal Code</label>
              <input
                id="postalCode"
                value={form.postalCode}
                onChange={handleChange("postalCode")}
                className="input-field mt-1"
                autoComplete="postal-code"
              />
              {errors.postalCode && <p className="text-xs text-sale mt-1">{errors.postalCode}</p>}
            </div>
          </div>

          {serverError && <p className="text-sm text-sale">{serverError}</p>}

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Placing Order..." : "Place Order · Cash on Delivery"}
          </button>
        </form>

        <div className="rounded-2xl border border-line p-5">
          <h2 className="font-display font-semibold text-lg">Order Summary</h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.itemId} className="flex items-center gap-3 text-sm">
                <div
                  className={`h-12 w-12 rounded-lg bg-cream flex items-center justify-center shrink-0 ${
                    item.product.image ? "" : "p-2"
                  }`}
                >
                  <ProductImage
                    product={item.product}
                    color={getColorHex(item.color) || item.product.colors[0]?.hex}
                    className="h-full w-full"
                  />
                </div>
                <div className="flex-1">
                  <p className="line-clamp-1">{item.product.name}</p>
                  <p className="text-graytext text-xs">Qty {item.quantity}</p>
                </div>
                <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 text-sm border-t border-line pt-4">
            <div className="flex justify-between">
              <span className="text-graytext">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-sale">
                <span>Discount (-{discountPercent}%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-graytext">Delivery Fee</span>
              <span>${DELIVERY_FEE.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-base">
              <span className="font-semibold">Total</span>
              <span className="font-display font-bold">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

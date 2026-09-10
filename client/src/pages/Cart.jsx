import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import QuantitySelector from "../components/QuantitySelector";
import Breadcrumbs from "../components/Breadcrumbs";
import ClothingIllustration from "../components/ClothingIllustration";
import ProductImage from "../components/ProductImage";
import { getColorHex } from "../utils/colors";
import api from "../api/client";

const DELIVERY_FEE = 15;

export default function Cart() {
  const { items, loading, updateQuantity, removeItem, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [applying, setApplying] = useState(false);

  const applyCoupon = async () => {
    if (!user) {
      setCouponError("Sign in to apply a promo code.");
      return;
    }
    if (!couponCode.trim()) return;
    setApplying(true);
    setCouponError("");
    try {
      const { data } = await api.post("/orders/apply-coupon", { code: couponCode.trim() });
      setCoupon(data);
    } catch (err) {
      setCoupon(null);
      setCouponError(err.response?.data?.error || "Couldn't apply that code.");
    } finally {
      setApplying(false);
    }
  };

  const discountAmount = coupon ? Math.round(((subtotal * coupon.percent) / 100) * 100) / 100 : 0;
  const total = items.length ? Math.max(0, subtotal - discountAmount + DELIVERY_FEE) : 0;

  const goToCheckout = () => {
    navigate("/checkout", { state: { couponCode: coupon?.code } });
  };

  if (loading) {
    return <div className="container-page py-24 text-center text-graytext">Loading your cart...</div>;
  }

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Cart" }]} />
      <h1 className="font-display font-bold text-3xl uppercase mt-4">Your Cart</h1>

      {items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-graytext">Your cart is empty.</p>
          <Link to="/shop" className="btn-primary mt-6 inline-flex">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid lg:grid-cols-[1fr_360px] gap-8 items-start">
          <ul className="space-y-4">
            {items.map((item) => (
              <li
                key={item.itemId}
                className="flex gap-4 rounded-2xl border border-line p-4"
              >
                <Link
                  to={`/product/${item.product.id}`}
                  className={`h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-xl overflow-hidden bg-cream flex items-center justify-center ${
                    item.product.image ? "" : "p-2 sm:p-3"
                  }`}
                >
                  <ProductImage
                    product={item.product}
                    color={getColorHex(item.color) || item.product.colors[0]?.hex}
                    className="h-full w-full"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link to={`/product/${item.product.id}`} className="font-display font-semibold line-clamp-1">
                      {item.product.name}
                    </Link>
                    <button
                      aria-label="Remove item"
                      onClick={() => removeItem(item.itemId)}
                      className="text-sale shrink-0"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-sm text-graytext mt-1">
                    {item.size && <>Size: {item.size} </>}
                    {item.color && <>Color: {item.color}</>}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="font-display font-semibold text-lg">${item.product.price}</span>
                    <QuantitySelector
                      value={item.quantity}
                      onChange={(q) => updateQuantity(item.itemId, q)}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="rounded-2xl border border-line p-5">
            <h2 className="font-display font-semibold text-lg">Order Summary</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-graytext">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              {coupon && (
                <div className="flex justify-between text-sale">
                  <span>Discount (-{coupon.percent}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-graytext">Delivery Fee</span>
                <span className="font-medium">${DELIVERY_FEE.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-base">
                <span className="font-semibold">Total</span>
                <span className="font-display font-bold">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Add promo code"
                className="input-field flex-1"
              />
              <button onClick={applyCoupon} disabled={applying} className="btn-primary px-6">
                Apply
              </button>
            </div>
            {couponError && <p className="mt-2 text-xs text-sale">{couponError}</p>}
            {coupon && <p className="mt-2 text-xs">Code {coupon.code} applied.</p>}

            <button onClick={goToCheckout} className="btn-primary w-full mt-5 gap-2">
              Go to Checkout <ArrowRight size={16} />
            </button>
            <p className="text-xs text-graytext mt-3">Try SHOPCO20 or WELCOME10.</p>
          </div>
        </div>
      )}
    </div>
  );
}

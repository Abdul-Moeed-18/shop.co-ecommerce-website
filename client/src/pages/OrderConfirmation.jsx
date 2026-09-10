import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import api from "../api/client";
import ClothingIllustration from "../components/ClothingIllustration";
import ProductImage from "../components/ProductImage";
import { getColorHex } from "../utils/colors";

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then((r) => setOrder(r.data.order))
      .catch(() => setError("We couldn't find that order."));
  }, [id]);

  if (error) {
    return (
      <div className="container-page py-24 text-center">
        <p className="text-graytext">{error}</p>
        <Link to="/shop" className="btn-primary mt-6 inline-flex">
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (!order) {
    return <div className="container-page py-24 text-center text-graytext">Loading order...</div>;
  }

  return (
    <div className="container-page py-16 max-w-xl text-center">
      <CheckCircle2 size={56} className="mx-auto text-green-600" />
      <h1 className="font-display font-bold text-3xl uppercase mt-6">Order Placed</h1>
      <p className="text-graytext mt-2">
        Thanks{order.shippingAddress?.fullName ? `, ${order.shippingAddress.fullName}` : ""} — your order
        has been received and is being prepared for delivery to {order.shippingAddress.address},{" "}
        {order.shippingAddress.city}.
      </p>

      <div className="mt-8 rounded-2xl border border-line p-5 text-left">
        <div className="flex justify-between text-sm">
          <span className="text-graytext">Order ID</span>
          <span className="font-mono">{order.id}</span>
        </div>
        <ul className="mt-4 space-y-3 border-t border-line pt-4">
          {order.items.map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-sm">
              {item.category && (
                <div
                  className={`h-12 w-12 rounded-lg bg-cream flex items-center justify-center shrink-0 ${
                    item.image ? "" : "p-2"
                  }`}
                >
                  <ProductImage
                    product={item}
                    color={getColorHex(item.color)}
                    className="h-full w-full"
                  />
                </div>
              )}
              <div className="flex-1">
                <p>{item.name}</p>
                <p className="text-graytext text-xs">Qty {item.quantity}</p>
              </div>
              <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-2 text-sm border-t border-line pt-4">
          <div className="flex justify-between">
            <span className="text-graytext">Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-sale">
              <span>Discount</span>
              <span>-${order.discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-graytext">Delivery Fee</span>
            <span>${order.deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-base">
            <span className="font-semibold">Total</span>
            <span className="font-display font-bold">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <Link to="/shop" className="btn-outline">
          Continue Shopping
        </Link>
        <Link to="/account" className="btn-primary">
          View Orders
        </Link>
      </div>
    </div>
  );
}

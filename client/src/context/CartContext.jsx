import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import api from "../api/client";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);
const GUEST_KEY = "shopco_guest_cart";

function readGuestCart() {
  try {
    return JSON.parse(localStorage.getItem(GUEST_KEY)) || [];
  } catch {
    return [];
  }
}
function writeGuestCart(items) {
  localStorage.setItem(GUEST_KEY, JSON.stringify(items));
}

export function CartProvider({ children }) {
  const { user, initializing } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const prevUserRef = useRef(undefined);

  const fetchServerCart = useCallback(async () => {
    const { data } = await api.get("/cart");
    setItems(data.items);
  }, []);

  useEffect(() => {
    if (initializing) return;

    const justLoggedIn = prevUserRef.current === null && user;
    prevUserRef.current = user;

    (async () => {
      setLoading(true);
      try {
        if (user) {
          if (justLoggedIn) {
            const guestItems = readGuestCart();
            if (guestItems.length) {
              await api.post("/cart/merge", { items: guestItems });
              writeGuestCart([]);
            }
          }
          await fetchServerCart();
        } else {
          setItems(readGuestCart());
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [user, initializing, fetchServerCart]);

  const addItem = async (product, { size, color, quantity = 1 } = {}) => {
    if (user) {
      const { data } = await api.post("/cart", { productId: product.id, size, color, quantity });
      setItems(data.items);
    } else {
      const guest = readGuestCart();
      const existing = guest.find(
        (i) => i.productId === product.id && i.size === size && i.color === color
      );
      if (existing) existing.quantity += quantity;
      else
        guest.push({
          itemId: `${product.id}-${size || "any"}-${color || "any"}`,
          productId: product.id,
          size: size || null,
          color: color || null,
          quantity,
          product,
        });
      writeGuestCart(guest);
      setItems(guest);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    if (user) {
      const { data } = await api.patch(`/cart/${itemId}`, { quantity });
      setItems(data.items);
    } else {
      const guest = readGuestCart().map((i) => (i.itemId === itemId ? { ...i, quantity } : i));
      writeGuestCart(guest);
      setItems(guest);
    }
  };

  const removeItem = async (itemId) => {
    if (user) {
      const { data } = await api.delete(`/cart/${itemId}`);
      setItems(data.items);
    } else {
      const guest = readGuestCart().filter((i) => i.itemId !== itemId);
      writeGuestCart(guest);
      setItems(guest);
    }
  };

  const clearCart = async () => {
    if (user) {
      await api.delete("/cart");
    } else {
      writeGuestCart([]);
    }
    setItems([]);
  };

  const subtotal = items.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, loading, addItem, updateQuantity, removeItem, clearCart, subtotal, itemCount, refresh: fetchServerCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

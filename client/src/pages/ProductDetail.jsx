import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import StarRating from "../components/StarRating";
import QuantitySelector from "../components/QuantitySelector";
import Breadcrumbs from "../components/Breadcrumbs";
import ProductCard from "../components/ProductCard";
import ClothingIllustration from "../components/ClothingIllustration";
import ProductImage from "../components/ProductImage";
import { useCart } from "../context/CartContext";

const TABS = ["Product Details", "Rating & Reviews", "FAQs"];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [color, setColor] = useState(null);
  const [size, setSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState(TABS[0]);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setError("");
    setAdded(false);
    api
      .get(`/products/${id}`)
      .then((r) => {
        setProduct(r.data.product);
        setRelated(r.data.related);
        setColor(r.data.product.colors[0]?.name || null);
        setSize(null);
        setQuantity(1);
      })
      .catch(() => setProduct(null));
  }, [id]);

  if (!product) {
    return <div className="container-page py-24 text-center text-graytext">Loading product...</div>;
  }

  const activeHex = product.colors.find((c) => c.name === color)?.hex || product.colors[0]?.hex;

  const handleAddToCart = async () => {
    if (product.sizes.length && !size) {
      setError("Please select a size.");
      return;
    }
    setError("");
    await addItem(product, { size, color, quantity });
    setAdded(true);
  };

  return (
    <div className="container-page py-8">
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Shop", to: "/shop" },
          { label: product.category, to: `/shop?category=${product.category}` },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid lg:grid-cols-2 gap-10">
        <div>
          <div
            className={`aspect-square rounded-2xl overflow-hidden bg-cream flex items-center justify-center ${
              product.image ? "" : "p-12"
            }`}
          >
            <ProductImage
              product={product}
              color={activeHex}
              className={product.image ? "" : "h-full w-full drop-shadow-sm"}
            />
          </div>
          {product.colors.length > 1 && (
            <div className="mt-4 flex gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  title={c.name}
                  className={`h-20 w-20 rounded-xl overflow-hidden bg-cream border-2 flex items-center justify-center p-3 ${
                    color === c.name ? "border-black" : "border-transparent"
                  }`}
                >
                  <ClothingIllustration category={product.category} color={c.hex} className="h-full w-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="font-display font-bold text-3xl uppercase">{product.name}</h1>
          <div className="mt-2">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-display font-bold text-3xl">${product.price}</span>
            {product.originalPrice && (
              <span className="text-graytext line-through text-2xl">${product.originalPrice}</span>
            )}
            {product.discount > 0 && (
              <span className="rounded-full bg-red-100 px-2.5 py-1 text-sm font-medium text-sale">
                -{product.discount}%
              </span>
            )}
          </div>
          <p className="mt-4 text-graytext">{product.description}</p>

          {product.colors.length > 0 && (
            <div className="mt-6 pt-6 border-t border-line">
              <p className="text-sm text-graytext mb-3">Select Colors</p>
              <div className="flex gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    title={c.name}
                    onClick={() => setColor(c.name)}
                    style={{ backgroundColor: c.hex }}
                    className={`h-9 w-9 rounded-full border border-black/10 ${
                      color === c.name ? "ring-2 ring-black ring-offset-2" : ""
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {product.sizes.length > 0 && (
            <div className="mt-6 pt-6 border-t border-line">
              <p className="text-sm text-graytext mb-3">Choose Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`rounded-full px-4 py-2 text-sm ${
                      size === s ? "bg-black text-white" : "bg-cream text-graytext hover:text-black"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-line flex items-center gap-4">
            <QuantitySelector value={quantity} onChange={setQuantity} />
            <button onClick={handleAddToCart} className="btn-primary flex-1">
              Add to Cart
            </button>
          </div>
          {error && <p className="mt-3 text-sm text-sale">{error}</p>}
          {added && (
            <p className="mt-3 text-sm">
              Added to your cart.{" "}
              <Link to="/cart" className="underline font-medium">
                View cart
              </Link>{" "}
              or keep browsing.
            </p>
          )}

          <div className="mt-10">
            <div className="flex gap-6 border-b border-line overflow-x-auto">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`pb-3 text-sm whitespace-nowrap ${
                    tab === t ? "border-b-2 border-black font-medium" : "text-graytext"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="pt-4 text-sm text-graytext">
              {tab === "Product Details" && <p>{product.description}</p>}
              {tab === "Rating & Reviews" && (
                <p>
                  {product.reviewCount} customers rated this product an average of {product.rating}{" "}
                  out of 5.
                </p>
              )}
              {tab === "FAQs" && (
                <p>Free returns within 30 days. Standard delivery takes 3-5 business days.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20 pt-10 border-t border-line">
          <h2 className="font-display font-bold text-2xl text-center uppercase">You Might Also Like</h2>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

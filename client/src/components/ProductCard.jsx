import { Link } from "react-router-dom";
import StarRating from "./StarRating";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div
        className={`aspect-[3/4] w-full overflow-hidden rounded-2xl bg-cream flex items-center justify-center ${
          product.image ? "" : "p-6"
        }`}
      >
        <ProductImage
          product={product}
          className={`transition-transform duration-300 group-hover:scale-105 ${
            product.image ? "" : "h-full w-full max-w-[70%] drop-shadow-sm"
          }`}
        />
      </div>
      <h3 className="mt-3 font-display font-semibold text-[15px] leading-snug line-clamp-1">
        {product.name}
      </h3>
      <div className="mt-1">
        <StarRating rating={product.rating} reviewCount={product.reviewCount} size={14} />
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="font-display font-semibold text-lg">${product.price}</span>
        {product.originalPrice && (
          <span className="text-graytext line-through text-lg">${product.originalPrice}</span>
        )}
        {product.discount > 0 && (
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-sale">
            -{product.discount}%
          </span>
        )}
      </div>
    </Link>
  );
}

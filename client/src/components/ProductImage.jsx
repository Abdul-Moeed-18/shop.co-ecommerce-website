import ClothingIllustration from "./ClothingIllustration";
import { imageFallback } from "../utils/image";

// Renders the real product photo when the product has one (product.image).
// Falls back to the drawn illustration for products that don't have a
// photo yet, so nothing on the site ever breaks.
export default function ProductImage({ product, color, className = "" }) {
  if (product?.image) {
    return (
      <img
        src={product.image}
        alt={product.name}
        onError={imageFallback(product.name)}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  return (
    <ClothingIllustration
      category={product?.category}
      color={color || product?.colors?.[0]?.hex}
      className={className}
    />
  );
}

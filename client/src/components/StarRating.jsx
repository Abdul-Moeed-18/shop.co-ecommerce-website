import { Star, StarHalf } from "lucide-react";

export default function StarRating({ rating = 0, reviewCount, size = 16 }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: full }).map((_, i) => (
          <Star key={`f${i}`} size={size} className="fill-star text-star" />
        ))}
        {half && <StarHalf size={size} className="fill-star text-star" />}
        {Array.from({ length: empty }).map((_, i) => (
          <Star key={`e${i}`} size={size} className="text-line" />
        ))}
      </div>
      {reviewCount !== undefined && (
        <span className="text-sm text-graytext">
          {rating.toFixed(1)}/5{typeof reviewCount === "number" ? ` (${reviewCount})` : ""}
        </span>
      )}
    </div>
  );
}

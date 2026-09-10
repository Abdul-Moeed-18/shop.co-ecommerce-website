import { useEffect, useState } from "react";
import { Check } from "lucide-react";

const COLOR_SWATCHES = [
  { name: "Black", hex: "#111111" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Red", hex: "#C22525" },
  { name: "Blue", hex: "#3B5FE2" },
  { name: "Navy", hex: "#1F2A44" },
  { name: "Green", hex: "#3B6B4A" },
  { name: "Grey", hex: "#8C8C8C" },
  { name: "Beige", hex: "#D8C9A3" },
  { name: "Gold", hex: "#C9A227" },
];

const SIZE_OPTIONS = ["Small", "Medium", "Large", "X-Large", "XX-Large", "28", "30", "32", "34", "36"];

export default function FilterSidebar({ categories, dressStyles, filters, onApply, className = "" }) {
  const [pending, setPending] = useState(filters);

  useEffect(() => setPending(filters), [filters]);

  const toggleCategory = (cat) => {
    setPending((p) => ({ ...p, category: p.category === cat ? "" : cat }));
  };
  const toggleStyle = (style) => {
    setPending((p) => ({ ...p, dressStyle: p.dressStyle === style ? "" : style }));
  };
  const toggleColor = (name) => {
    setPending((p) => ({ ...p, color: p.color === name ? "" : name }));
  };
  const toggleSize = (size) => {
    setPending((p) => ({ ...p, size: p.size === size ? "" : size }));
  };

  return (
    <aside className={`${className}`}>
      <div className="rounded-2xl border border-line p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold">Filters</h3>
        </div>

        <div className="mt-4 border-t border-line pt-4">
          <p className="font-medium text-sm mb-3">Category</p>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`text-sm w-full text-left ${
                    pending.category === cat ? "font-semibold" : "text-graytext"
                  } hover:text-black`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 border-t border-line pt-4">
          <p className="font-medium text-sm mb-3">Price</p>
          <input
            type="range"
            min="0"
            max="500"
            step="10"
            value={pending.maxPrice || 500}
            onChange={(e) => setPending((p) => ({ ...p, maxPrice: Number(e.target.value) }))}
            className="w-full"
          />
          <div className="mt-2 text-xs text-graytext">Up to ${pending.maxPrice || 500}</div>
        </div>

        <div className="mt-4 border-t border-line pt-4">
          <p className="font-medium text-sm mb-3">Colors</p>
          <div className="flex flex-wrap gap-2">
            {COLOR_SWATCHES.map((c) => (
              <button
                key={c.name}
                type="button"
                title={c.name}
                onClick={() => toggleColor(c.name)}
                style={{ backgroundColor: c.hex }}
                className={`h-7 w-7 rounded-full border border-black/10 flex items-center justify-center ${
                  pending.color === c.name ? "ring-2 ring-black ring-offset-2" : ""
                }`}
              >
                {pending.color === c.name && (
                  <Check size={14} className={c.hex === "#FFFFFF" ? "text-black" : "text-white"} />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 border-t border-line pt-4">
          <p className="font-medium text-sm mb-3">Size</p>
          <div className="flex flex-wrap gap-2">
            {SIZE_OPTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleSize(s)}
                className={`rounded-full border px-3 py-1.5 text-xs ${
                  pending.size === s
                    ? "bg-black text-white border-black"
                    : "border-line text-graytext hover:border-black hover:text-black"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 border-t border-line pt-4">
          <p className="font-medium text-sm mb-3">Dress Style</p>
          <ul className="space-y-2">
            {dressStyles.map((style) => (
              <li key={style}>
                <button
                  type="button"
                  onClick={() => toggleStyle(style)}
                  className={`text-sm w-full text-left ${
                    pending.dressStyle === style ? "font-semibold" : "text-graytext"
                  } hover:text-black`}
                >
                  {style}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button type="button" onClick={() => onApply(pending)} className="btn-primary w-full mt-6">
          Apply Filter
        </button>
      </div>
    </aside>
  );
}

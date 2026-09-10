import { Minus, Plus } from "lucide-react";

export default function QuantitySelector({ value, onChange, min = 1, max = 99 }) {
  return (
    <div className="flex items-center gap-3 sm:gap-4 rounded-full bg-cream px-3 sm:px-4 py-2 sm:py-2.5 shrink-0">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="disabled:opacity-30"
      >
        <Minus size={16} />
      </button>
      <span className="w-5 text-center text-sm font-medium">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="disabled:opacity-30"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}

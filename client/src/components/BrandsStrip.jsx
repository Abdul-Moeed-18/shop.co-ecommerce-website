const BRANDS = ["VERSACE", "ZARA", "GUCCI", "PRADA", "Calvin Klein"];

export default function BrandsStrip() {
  return (
    <div className="bg-black">
      <div className="container-page py-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {BRANDS.map((b) => (
          <span
            key={b}
            className="text-white/90 font-display font-semibold text-xl sm:text-2xl tracking-wide"
          >
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}

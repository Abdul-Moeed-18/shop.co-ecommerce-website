// If a product photo fails to load, fall back to a labeled placeholder
// instead of showing a broken image icon.
export function imageFallback(name, size = "600x750") {
  return (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = `https://placehold.co/${size}/F2F0F1/111111?text=${encodeURIComponent(
      name
    )}&font=poppins`;
  };
}

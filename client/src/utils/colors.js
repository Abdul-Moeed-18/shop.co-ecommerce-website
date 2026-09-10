const COLOR_HEX = {
  Black: "#111111",
  White: "#FFFFFF",
  Red: "#C22525",
  Blue: "#3B5FE2",
  Navy: "#1F2A44",
  Green: "#3B6B4A",
  Olive: "#5C5A3B",
  Grey: "#8C8C8C",
  Gray: "#8C8C8C",
  Beige: "#D8C9A3",
  Gold: "#C9A227",
  Indigo: "#2B3A67",
  Khaki: "#8A8360",
  Charcoal: "#3A3A3A",
  Stone: "#C9C1AE",
  "Light Blue": "#9DB6D9",
};

export function getColorHex(name) {
  return COLOR_HEX[name] || "#111111";
}

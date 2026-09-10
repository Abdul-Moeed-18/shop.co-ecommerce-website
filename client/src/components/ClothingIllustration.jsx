// Flat, minimal garment silhouettes rendered as inline SVG and colored with
// the product's own swatch. No network request, so nothing to ever break.
const SHAPES = {
  "T-shirts": {
    body: "M70,20 L85,10 L100,25 L115,10 L130,20 L165,35 L150,75 L130,60 L130,225 L70,225 L70,60 L50,75 L35,35 Z",
    extras: null,
  },
  Polo: {
    body: "M70,20 L85,10 L100,25 L115,10 L130,20 L165,35 L150,75 L130,60 L130,225 L70,225 L70,60 L50,75 L35,35 Z",
    extras: (accent) => (
      <>
        <path d="M85,10 L100,25 L92,40 Z" fill={accent} opacity="0.35" />
        <path d="M115,10 L100,25 L108,40 Z" fill={accent} opacity="0.35" />
        <line x1="100" y1="30" x2="100" y2="70" stroke={accent} strokeWidth="2" opacity="0.5" />
        <circle cx="100" cy="40" r="2" fill={accent} opacity="0.6" />
        <circle cx="100" cy="55" r="2" fill={accent} opacity="0.6" />
      </>
    ),
  },
  Shirts: {
    body: "M70,20 L88,8 L100,22 L112,8 L130,20 L175,50 L150,150 L130,70 L130,225 L70,225 L70,70 L50,150 L25,50 Z",
    extras: (accent) => (
      <>
        <line x1="100" y1="22" x2="100" y2="225" stroke={accent} strokeWidth="2" opacity="0.45" />
        {[45, 70, 95, 120, 145, 170, 195].map((y) => (
          <circle key={y} cx="100" cy={y} r="1.8" fill={accent} opacity="0.6" />
        ))}
      </>
    ),
  },
  Jeans: {
    body: "M55,10 L145,10 L145,45 L130,225 L105,225 L100,60 L95,225 L70,225 L55,45 Z",
    extras: (accent) => (
      <>
        <line x1="55" y1="28" x2="145" y2="28" stroke={accent} strokeWidth="2" opacity="0.35" />
        <line x1="118" y1="45" x2="128" y2="220" stroke={accent} strokeWidth="1.5" opacity="0.3" />
        <line x1="82" y1="45" x2="72" y2="220" stroke={accent} strokeWidth="1.5" opacity="0.3" />
      </>
    ),
  },
  Trousers: {
    body: "M55,10 L145,10 L145,45 L130,225 L105,225 L100,60 L95,225 L70,225 L55,45 Z",
    extras: (accent) => (
      <line x1="55" y1="28" x2="145" y2="28" stroke={accent} strokeWidth="2" opacity="0.3" />
    ),
  },
  Shorts: {
    body: "M55,10 L145,10 L145,45 L130,140 L105,140 L100,60 L95,140 L70,140 L55,45 Z",
    extras: (accent) => (
      <line x1="55" y1="28" x2="145" y2="28" stroke={accent} strokeWidth="2" opacity="0.3" />
    ),
  },
  Hoodies: {
    body: "M70,25 L85,14 L100,28 L115,14 L130,25 L165,40 L150,80 L130,65 L130,225 L70,225 L70,65 L50,80 L35,40 Z",
    extras: (accent) => (
      <>
        <path d="M78,20 Q100,-12 122,20 Q112,32 100,29 Q88,32 78,20 Z" fill={accent} opacity="0.3" />
        <rect x="80" y="145" width="40" height="35" rx="6" fill="none" stroke={accent} strokeWidth="2" opacity="0.4" />
        <line x1="94" y1="30" x2="90" y2="55" stroke={accent} strokeWidth="1.5" opacity="0.4" />
        <line x1="106" y1="30" x2="110" y2="55" stroke={accent} strokeWidth="1.5" opacity="0.4" />
      </>
    ),
  },
  Blazers: {
    body: "M65,15 L100,90 L135,15 L180,55 L155,155 L130,75 L130,225 L70,225 L70,75 L45,155 L20,55 Z",
    extras: (accent) => (
      <>
        <circle cx="100" cy="130" r="2" fill={accent} opacity="0.6" />
        <circle cx="100" cy="150" r="2" fill={accent} opacity="0.6" />
      </>
    ),
  },
  Jackets: {
    body: "M70,20 L88,8 L100,22 L112,8 L130,20 L175,50 L150,150 L130,70 L130,225 L70,225 L70,70 L50,150 L25,50 Z",
    extras: (accent) => (
      <line x1="100" y1="22" x2="100" y2="225" stroke={accent} strokeWidth="3" opacity="0.4" />
    ),
  },
};

const DEFAULT_SHAPE = SHAPES["T-shirts"];

function contrastAccent(hex) {
  if (!hex) return "#000000";
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.65 ? "#00000099" : "#ffffffb3";
}

export default function ClothingIllustration({ category, color = "#111111", className = "" }) {
  const shape = SHAPES[category] || DEFAULT_SHAPE;
  const accent = contrastAccent(color);

  return (
    <svg viewBox="0 0 200 240" className={className} role="img" aria-label={category}>
      <path d={shape.body} fill={color} stroke={accent} strokeWidth="1.5" strokeLinejoin="round" />
      {shape.extras ? shape.extras(accent) : null}
    </svg>
  );
}

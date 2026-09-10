import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import ProductCard from "../components/ProductCard";
import BrandsStrip from "../components/BrandsStrip";
import ClothingIllustration from "../components/ClothingIllustration";

const STATS = [
  { value: "200+", label: "International Brands" },
  { value: "2,000+", label: "High-Quality Products" },
  { value: "30,000+", label: "Happy Customers" },
];

const DRESS_STYLES = [
  { name: "Casual", category: "T-shirts", color: "#3B5FE2" },
  { name: "Formal", category: "Blazers", color: "#1F2A44" },
  { name: "Party", category: "Shirts", color: "#C9A227" },
  { name: "Gym", category: "Hoodies", color: "#111111" },
];

const HERO_GARMENTS = [
  { category: "T-shirts", color: "#111111", rotate: "-8deg", z: 10 },
  { category: "Jackets", color: "#2B3A67", rotate: "6deg", z: 20 },
  { category: "Jeans", color: "#1F2A44", rotate: "-3deg", z: 5 },
];

export default function Home() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [topSelling, setTopSelling] = useState([]);

  useEffect(() => {
    api.get("/products", { params: { isNew: true, limit: 4 } }).then((r) => setNewArrivals(r.data.products));
    api.get("/products", { params: { sort: "rating", limit: 4 } }).then((r) => setTopSelling(r.data.products));
  }, []);

  return (
    <div>
      <section className="bg-cream overflow-hidden">
        <div className="container-page grid lg:grid-cols-2 gap-10 items-center py-10 lg:py-0">
          <div>
            <h1 className="font-display font-black text-4xl sm:text-5xl xl:text-6xl leading-[1.05] uppercase">
              Find clothes that matches your style
            </h1>
            <p className="mt-6 text-graytext max-w-md">
              Browse through our diverse range of meticulously crafted garments, designed to bring out
              your individuality and cater to your sense of style.
            </p>
            <Link to="/shop" className="btn-primary mt-8">
              Shop Now
            </Link>

            <div className="mt-10 flex flex-wrap gap-8 border-t border-black/10 pt-8">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="font-display font-bold text-2xl sm:text-3xl">{s.value}</p>
                  <p className="text-sm text-graytext max-w-[9rem]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-[380px] sm:h-[460px] flex items-center justify-center gap-2">
            {HERO_GARMENTS.map((g, i) => (
              <div
                key={g.category + i}
                className="w-1/3 max-w-[190px]"
                style={{ transform: `rotate(${g.rotate})`, zIndex: g.z, marginTop: i === 1 ? "-2rem" : 0 }}
              >
                <ClothingIllustration category={g.category} color={g.color} className="drop-shadow-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <BrandsStrip />

      <section className="container-page py-16">
        <h2 className="font-display font-bold text-3xl text-center uppercase">New Arrivals</h2>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/shop?isNew=true" className="btn-outline">
            View All
          </Link>
        </div>
      </section>

      <section className="container-page py-16 border-t border-line">
        <h2 className="font-display font-bold text-3xl text-center uppercase">Top Selling</h2>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {topSelling.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/shop" className="btn-outline">
            View All
          </Link>
        </div>
      </section>

      <section className="bg-cream py-16">
        <div className="container-page">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-center uppercase mb-10">
            Browse by dress style
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {DRESS_STYLES.map((style, i) => (
              <Link
                key={style.name}
                to={`/shop?dressStyle=${style.name}`}
                className={`relative rounded-2xl overflow-hidden bg-white group flex items-center justify-center p-6 ${
                  i === 0 || i === 3 ? "lg:col-span-2" : "lg:col-span-1"
                } h-56`}
              >
                <ClothingIllustration
                  category={style.category}
                  color={style.color}
                  className="h-full max-w-[110px] transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute top-5 left-6 font-display font-bold text-2xl">{style.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

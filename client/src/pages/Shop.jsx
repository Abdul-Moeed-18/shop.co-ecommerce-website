import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import api from "../api/client";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";
import Breadcrumbs from "../components/Breadcrumbs";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [categories, setCategories] = useState([]);
  const [dressStyles, setDressStyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filters = useMemo(
    () => ({
      category: searchParams.get("category") || "",
      dressStyle: searchParams.get("dressStyle") || "",
      color: searchParams.get("color") || "",
      size: searchParams.get("size") || "",
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : 500,
      search: searchParams.get("search") || "",
      isNew: searchParams.get("isNew") || "",
      onSale: searchParams.get("onSale") || "",
      sort: searchParams.get("sort") || "",
      page: Number(searchParams.get("page") || 1),
    }),
    [searchParams]
  );

  useEffect(() => {
    api.get("/products/categories").then((r) => {
      setCategories(r.data.categories);
      setDressStyles(r.data.dressStyles);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { ...filters, limit: 9 };
    Object.keys(params).forEach((k) => (params[k] === "" ? delete params[k] : null));
    api
      .get("/products", { params })
      .then((r) => {
        setProducts(r.data.products);
        setMeta({ total: r.data.total, totalPages: r.data.totalPages });
      })
      .finally(() => setLoading(false));
  }, [filters]);

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === "" || value === undefined || value === null) next.delete(key);
      else next.set(key, value);
    });
    next.delete("page");
    setSearchParams(next);
    setMobileFiltersOpen(false);
  };

  const goToPage = (page) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", page);
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageTitle = filters.category || filters.dressStyle || (filters.search && `Results for "${filters.search}"`) || "All Products";

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Shop" }]} />

      <div className="mt-6 grid lg:grid-cols-[260px_1fr] gap-8">
        <FilterSidebar
          categories={categories}
          dressStyles={dressStyles}
          filters={filters}
          onApply={updateParams}
          className="hidden lg:block"
        />

        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
            <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white overflow-y-auto p-4">
              <button className="mb-2" onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
                <X size={22} />
              </button>
              <FilterSidebar
                categories={categories}
                dressStyles={dressStyles}
                filters={filters}
                onApply={updateParams}
              />
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="font-display font-bold text-2xl capitalize">{pageTitle}</h1>
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <SlidersHorizontal size={15} /> Filters
              </button>
              <select
                value={filters.sort}
                onChange={(e) => updateParams({ sort: e.target.value })}
                className="rounded-full border border-line px-4 py-2 text-sm"
              >
                <option value="">Most Recent</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
          <p className="text-sm text-graytext mt-1">
            {loading ? "Loading..." : `Showing ${products.length} of ${meta.total} Products`}
          </p>

          {!loading && products.length === 0 && (
            <div className="py-24 text-center">
              <p className="font-display font-semibold text-lg">No products match those filters</p>
              <Link to="/shop" className="btn-outline mt-4 inline-flex">
                Clear filters
              </Link>
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              {Array.from({ length: meta.totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i + 1)}
                  className={`h-9 w-9 rounded-full text-sm ${
                    filters.page === i + 1 ? "bg-black text-white" : "text-graytext hover:bg-cream"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

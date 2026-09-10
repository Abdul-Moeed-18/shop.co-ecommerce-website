import { Link } from "react-router-dom";
import { Twitter, Facebook, Instagram, Github } from "lucide-react";

const COLUMNS = [
  {
    title: "Company",
    links: ["About", "Features", "Works", "Career"],
  },
  {
    title: "Help",
    links: ["Customer Support", "Delivery Details", "Terms & Conditions", "Privacy Policy"],
  },
  {
    title: "Faq",
    links: ["Account", "Manage Deliveries", "Orders", "Payments"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-cream mt-24">
      <div className="container-page py-14 grid grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-10 sm:gap-10">
        <div className="col-span-2">
          <Link to="/" className="font-display text-2xl font-black tracking-tight">
            SHOP.CO
          </Link>
          <p className="mt-4 text-sm text-graytext max-w-xs">
            We have clothes that suit your style and which you're proud to wear. From women to men.
          </p>
          <div className="mt-5 flex items-center gap-3">
            {[Twitter, Facebook, Instagram, Github].map((Icon, i) => (
              <span
                key={i}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-graytext/40"
              >
                <Icon size={15} />
              </span>
            ))}
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="font-medium tracking-wide text-sm mb-4">{col.title}</h4>
            <ul className="space-y-3">
              {col.links.map((l) => (
                <li key={l}>
                  <span className="text-sm text-graytext">{l}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-black/10">
        <div className="container-page py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-graytext">SHOP.CO © 2026, All Rights Reserved</p>
          <p className="text-xs text-graytext">Built with React &amp; Express</p>
        </div>
      </div>
    </footer>
  );
}

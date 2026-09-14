import { NavLink } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import {
  LayoutDashboard,
  ShoppingBag,
  FolderKanban,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

const mainLinks = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    path: "/admin/products",
    icon: ShoppingBag,
  },
  {
    name: "Categories",
    path: "/admin/categories",
    icon: FolderKanban,
  },
  {
    name: "Orders",
    path: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    name: "Customers",
    path: "/admin/customers",
    icon: Users,
  },
];

const systemLinks = [
  {
    name: "Analytics",
    path: "/admin/analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const { logout } = useAuthContext();
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
      isActive
        ? "bg-slate-900 text-white shadow-lg"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 bg-white border-r border-slate-200 lg:block">
      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            SHOP.CO
          </h1>
          <p className="text-xs text-slate-400 mt-1">Admin Dashboard</p>
        </div>
      </div>

      <div className="p-4 overflow-y-auto h-[calc(100vh-80px)]">
        <p className="px-3 mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Main
        </p>

        <nav className="space-y-1">
          {mainLinks.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/admin"}
                className={linkClass}
              >
                <Icon size={19} />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <p className="px-3 mb-3 mt-8 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          System
        </p>

        <nav className="space-y-1">
          {systemLinks.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={linkClass}
              >
                <Icon size={19} />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-8 pt-4 border-t border-slate-200">
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition">
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
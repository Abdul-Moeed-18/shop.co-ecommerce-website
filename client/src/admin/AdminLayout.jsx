import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
  const navItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Products", path: "/admin/products" },
    { name: "Orders", path: "/admin/orders" },
    { name: "Users", path: "/admin/users" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r min-h-screen">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold">SHOP.CO</h1>
          <p className="text-sm text-gray-500 mt-1">Admin Dashboard</p>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg font-medium ${
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1">
        <header className="bg-white border-b px-8 py-5">
          <h2 className="text-xl font-semibold">Admin Panel</h2>
        </header>

        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
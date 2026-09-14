import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "../admin.css";
import AdminLayout from "../components/layout/AdminLayout";
import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import AddProduct from "../pages/AddProduct";
import EditProduct from "../pages/EditProduct";
import Categories from "../pages/Categories";
import Orders from "../pages/Orders";
import Customers from "../pages/Customers";
import Analytics from "../pages/Analytics";
import Settings from "../pages/Settings";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import { AuthProvider, useAuthContext } from "../context/AuthContext";

function ProtectedAdmin() {
  const { user, loading } = useAuthContext();
  const location = useLocation();
  if (loading) return <div className="min-h-screen grid place-items-center bg-slate-100">Loading...</div>;
  if (!user) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  return <AdminLayout />;
}

export default function AdminRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<ProtectedAdmin />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/new" element={<AddProduct />} />
          <Route path="products/:id/edit" element={<EditProduct />} />
          <Route path="categories" element={<Categories />} />
          <Route path="orders" element={<Orders />} />
          <Route path="customers" element={<Customers />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

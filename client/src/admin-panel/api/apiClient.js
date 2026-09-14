import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("shopco_admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const apiClient = {
  async login(email, password) {
    const { data } = await api.post("/admin/login", { email, password });
    return data;
  },
  async getMe() {
    const { data } = await api.get("/admin/me");
    return data.admin;
  },
  async getProducts() {
    const { data } = await api.get("/admin/products");
    return data;
  },
  async getProduct(id) {
    const { data } = await api.get(`/admin/products/${id}`);
    return data.product;
  },
  async createProduct(product) {
    const { data } = await api.post("/admin/products", product);
    return data.product;
  },
  async updateProduct(id, product) {
    const { data } = await api.put(`/admin/products/${id}`, product);
    return data.product;
  },

  async deleteProduct(id) {
    const { data } = await api.delete(`/admin/products/${id}`);
    return data;
  },

  async getCustomers() {
    const { data } = await api.get("/admin/customers");
    return data;
  },
};
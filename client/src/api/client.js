import axios from "axios";

// In local dev, Vite proxies /api to the Express server (see vite.config.js).
// In production, set VITE_API_BASE_URL in your hosting provider's env vars
// to your deployed backend's URL, e.g. https://your-api.onrender.com/api
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  withCredentials: true,
});

export default api;

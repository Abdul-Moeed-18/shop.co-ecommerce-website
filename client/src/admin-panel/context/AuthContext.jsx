import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiClient } from "../api/apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("shopco_admin_token");
    if (!token) {
      setLoading(false);
      return;
    }

    apiClient.getMe()
      .then(setUser)
      .catch(() => sessionStorage.removeItem("shopco_admin_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const data = await apiClient.login(email, password);
    sessionStorage.setItem("shopco_admin_token", data.token);
    setUser(data.admin);
    return data.admin;
  };

  const logout = () => {
    sessionStorage.removeItem("shopco_admin_token");
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}

export { AuthContext };

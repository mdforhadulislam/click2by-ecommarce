"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ApiService } from "@/lib/api";

interface User {
  id: string;
  full_name?: string;
  name?: string;
  email: string;
  phone: string;
  role?: "customer" | "admin" | "affiliate";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAffiliate: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load saved auth from localStorage
  useEffect(() => {
    const storedAccess = localStorage.getItem("access_token");
    const storedRefresh = localStorage.getItem("refresh_token");
    const storedUser = localStorage.getItem("user_data");

    if (storedAccess && storedUser) {
      setToken(storedAccess);
      setUser(JSON.parse(storedUser));
      if (storedRefresh) setRefreshToken(storedRefresh);
    }
    setLoading(false);
  }, []);

  const login = async (phone: string, password: string) => {
    try {
      const response: any = await ApiService.auth.login({ phone, password });
      console.log("Login response:", response);

      const access = response.tokens?.access || response.access;
      const refresh = response.tokens?.refresh || response.refresh;
      const userData = response.user || response.data?.user || response.data;

      if (!access || !userData) throw new Error("Invalid login response");

      setToken(access);
      setRefreshToken(refresh || null);
      setUser(userData);

      localStorage.setItem("access_token", access);
      if (refresh) localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("user_data", JSON.stringify(userData));
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "Login failed");
    }
  };

  const register = async (data: any) => {
    try {
      const response: any = await ApiService.auth.register(data);
      const access = response.tokens?.access || response.access;
      const refresh = response.tokens?.refresh || response.refresh;
      const userData = response.user || response.data?.user || response.data;

      if (access && userData) {
        setToken(access);
        setRefreshToken(refresh || null);
        setUser(userData);
        localStorage.setItem("access_token", access);
        if (refresh) localStorage.setItem("refresh_token", refresh);
        localStorage.setItem("user_data", JSON.stringify(userData));
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      throw new Error(error.message || "Registration failed");
    }
  };

  const logout = () => {
    if (token) {
      ApiService.auth.logout(token).catch(console.error);
    }
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_data");
  };

  // Optional: Auto-refresh token if expired
  useEffect(() => {
    if (!refreshToken) return;

    const refreshAccess = async () => {
      try {
        const response = await ApiService.auth.refresh({ refresh: refreshToken });
        if (response.access) {
          setToken(response.access);
          localStorage.setItem("access_token", response.access);
        }
      } catch (err) {
        console.error("Token refresh failed:", err);
        logout();
      }
    };

    // refresh token every 14 mins (JWT default = 15m)
    const interval = setInterval(refreshAccess, 14 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshToken]);

  const value: AuthContextType = {
    user,
    token,
    refreshToken,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === "admin",
    isAffiliate: user?.role === "affiliate",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
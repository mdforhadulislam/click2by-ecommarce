"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ApiService } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role?: 'customer' | 'admin' | 'affiliate';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load token from localStorage on mount
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user_data');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (phone: string, password: string) => {
    try {
      const response: any = await ApiService.auth.login({ phone, password });
      
      const authToken = response.token || response.access || response.data?.token;
      const userData = response.user || response.data?.user || response.data;
      
      setToken(authToken);
      setUser(userData);
      
      localStorage.setItem('auth_token', authToken);
      localStorage.setItem('user_data', JSON.stringify(userData));
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (data: any) => {
    try {
      const response: any = await ApiService.auth.register(data);
      
      // Some APIs auto-login after registration
      if (response.token) {
        const authToken = response.token;
        const userData = response.user || response.data;
        
        setToken(authToken);
        setUser(userData);
        
        localStorage.setItem('auth_token', authToken);
        localStorage.setItem('user_data', JSON.stringify(userData));
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = () => {
    if (token) {
      ApiService.auth.logout(token).catch(console.error);
    }
    
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    isAffiliate: user?.role === 'affiliate',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

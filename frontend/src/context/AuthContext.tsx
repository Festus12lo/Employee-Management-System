import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import type { UserProfile } from '../types/employee';

interface AuthContextValue {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('ems_auth_token');
      const storedUser = localStorage.getItem('ems_user');
      if (storedToken && storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Default authenticated demo staff session if not set, or keep logged in
        const demoUser: UserProfile = {
          email: 'admin@company.com',
          name: 'Staff Administrator',
          role: 'HR Admin',
        };
        localStorage.setItem('ems_auth_token', 'demo-ems-token-initial');
        localStorage.setItem('ems_user', JSON.stringify(demoUser));
        setUser(demoUser);
      }
    } catch {
      localStorage.removeItem('ems_auth_token');
      localStorage.removeItem('ems_user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password?: string) => {
    const res = await api.login({ email, password });
    localStorage.setItem('ems_auth_token', res.token);
    localStorage.setItem('ems_user', JSON.stringify(res.user));
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem('ems_auth_token');
    localStorage.removeItem('ems_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

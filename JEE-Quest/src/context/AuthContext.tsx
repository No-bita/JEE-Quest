import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string, expiresIn?: number) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'authToken';
const EXPIRY_KEY = 'authTokenExpiry';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem(TOKEN_KEY));

  useEffect(() => {
    // Check token expiry on mount
    const expiry = localStorage.getItem(EXPIRY_KEY);
    if (expiry && Date.now() > parseInt(expiry, 10)) {
      logout();
    }
  }, []);

  useEffect(() => {
    // Set up interval to check token expiry
    const interval = setInterval(() => {
      const expiry = localStorage.getItem(EXPIRY_KEY);
      if (expiry && Date.now() > parseInt(expiry, 10)) {
        logout();
      }
    }, 60 * 1000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const login = (newToken: string, expiresIn: number = 3600) => {
    setToken(newToken);
    setIsAuthenticated(true);
    localStorage.setItem(TOKEN_KEY, newToken);
    const expiry = Date.now() + expiresIn * 1000;
    localStorage.setItem(EXPIRY_KEY, expiry.toString());
  };

  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRY_KEY);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

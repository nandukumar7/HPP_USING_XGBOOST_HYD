
import React, { createContext, useContext, useState, useEffect } from "react";

type User = {
  name?: string;
  email: string;
  id: string; // Adding user ID to uniquely identify users
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is stored in localStorage on initial load
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse stored user", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = (userData: User) => {
    // Ensure user has an ID
    const userWithId = {
      ...userData,
      id: userData.id || `user_${Date.now()}` // Generate an ID if not provided
    };
    
    setUser(userWithId);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userWithId));
  };

  const logout = () => {
    // Clear user-specific saved predictions
    if (user?.id) {
      localStorage.removeItem(`savedPredictions_${user.id}`);
    }
    
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

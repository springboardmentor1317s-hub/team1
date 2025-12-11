import React, { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "./api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("ceh_user") || "null")
  );
  const [token, setToken] = useState(() =>
    localStorage.getItem("ceh_token") || ""
  );
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await apiRequest("/auth/login", "POST", { email, password });
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("ceh_user", JSON.stringify(data.user));
      localStorage.setItem("ceh_token", data.token);
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const data = await apiRequest("/auth/register", "POST", payload);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("ceh_user", JSON.stringify(data.user));
      localStorage.setItem("ceh_token", data.token);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("ceh_user");
    localStorage.removeItem("ceh_token");
  };

  const value = { user, token, loading, login, register, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

import { createContext, useState, useEffect } from "react";
import { supabase } from "../services/supabaseService.js";
import api from "../services/apiService.js";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);

    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === "SIGNED_OUT") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  async function login(email, password) {
    try {
      const res = await api.post("/auth/login", { email, password });
      const responseData = res.data.data;

      const { token, ...userData } = responseData;
      if (!token) {
        throw new Error("Token não recebido no login.");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (err) {
      console.error("Erro no login:", err.response?.data.error || err.message);
      return false;
    }
  }

  function logout() {
    try {
      supabase.auth.signOut();
    } catch (err) {
      console.warn("Erro ao deslogar do Supabase:", err.message);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  }

  function updateUserContext(updatedData) {
    if (!updatedData) {
      return;
    }
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  }

  return (
    <AuthContext.Provider
      value={
        {
          user,
          login,
          logout,
          updateUserContext,
          loading,
          isAuthenticated: !!user
        }
      }
    >
      {children}
    </AuthContext.Provider>
  );
}

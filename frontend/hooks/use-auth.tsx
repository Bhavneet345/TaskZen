"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  registerUser: (name: string, email: string, password: string) => Promise<void>;
  loginUser: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => void;
  loginWithGithub: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // ✅ Restore User on Page Load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserData(token);
    }

    // ✅ Handle OAuth Redirect
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      fetchUserData(tokenFromUrl);
      router.push("/dashboard"); // ✅ Remove token from URL
    }
  }, []);

  // ✅ Fetch User Data
  const fetchUserData = async (token: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUser({ ...data.user, token });
      } else {
        logout();
      }
    } catch (error) {
      console.error("Authentication error:", error);
      logout();
    }
  };

  // 🔹 Register User
  const registerUser = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      localStorage.setItem("token", data.token);
      setUser({ ...data.user, token: data.token });
      router.push("/dashboard");
    } catch (error) {
      console.error("Registration Error:", error);
    }
  };

  // 🔹 Login User
  const loginUser = async (email: string, password: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid credentials");

      localStorage.setItem("token", data.token);
      setUser({ ...data.user, token: data.token });
      router.push("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  // 🔹 Google & GitHub Login
  const loginWithGoogle = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`;
  };

  const loginWithGithub = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/github`;
  };

  // 🔹 Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, registerUser, loginUser, loginWithGoogle, loginWithGithub, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Fix TypeScript Error: Ensure `useAuth` Returns Correct Type
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

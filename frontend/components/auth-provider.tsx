"use client"

import React, { createContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import type { User } from "@/types/user"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  loginWithGoogle: () => void
  loginWithGithub: () => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter() // ✅ Fix: Add router for redirection

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsLoading(false);
          return;
        }
  
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (res.ok) {
          const userData = await res.json();
          setUser(userData.user);
        } else if (res.status === 401) {
          console.warn("🔴 Unauthorized: Removing token");
          localStorage.removeItem("token");
          setUser(null);
        } else {
          console.error("⚠️ Server error, but keeping token");
        }
      } catch (error) {
        console.error("❌ Authentication error:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    checkAuth();
  }, []);  

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) throw new Error("Invalid credentials")

      const data = await res.json()
      localStorage.setItem("token", data.token)
      setUser(data.user)
      router.push("/dashboard") // ✅ Fix: Redirect to dashboard after login
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      if (!res.ok) throw new Error("Registration failed")

      const data = await res.json()
      localStorage.setItem("token", data.token)
      setUser(data.user)
      router.push("/dashboard") // ✅ Fix: Redirect to dashboard after registration
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  const loginWithGoogle = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`
  }

  const loginWithGithub = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/github`
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    window.location.href = "/login" // ✅ Fix: Ensure user is redirected after logout
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        loginWithGoogle,
        loginWithGithub,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

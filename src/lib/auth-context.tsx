"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Profile } from "./types";
import { SEED_PROFILES } from "@/data/anatomy-seed";

interface AuthContextType {
  currentUser: Profile | null;
  isLoaded: boolean;
  switchUser: (userId: string) => void;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  availableUsers: Profile[];
  isAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Khi mới vào web: chưa đăng nhập (null) trừ khi đã lưu phiên trước đó trong localStorage
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [usersList, setUsersList] = useState<Profile[]>(SEED_PROFILES);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const savedUserId = typeof window !== "undefined" ? localStorage.getItem("medread_active_user_id") : null;

    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        const list: Profile[] = data.users && data.users.length > 0 ? data.users : SEED_PROFILES;
        setUsersList(list);
        if (savedUserId) {
          const found = list.find((p) => p.id === savedUserId);
          if (found) setCurrentUser(found);
          else setCurrentUser(null);
        } else {
          setCurrentUser(null);
        }
        setIsLoaded(true);
      })
      .catch(() => {
        setUsersList(SEED_PROFILES);
        if (savedUserId) {
          const found = SEED_PROFILES.find((p) => p.id === savedUserId);
          if (found) setCurrentUser(found);
          else setCurrentUser(null);
        } else {
          setCurrentUser(null);
        }
        setIsLoaded(true);
      });
  }, []);

  const switchUser = (userId: string) => {
    const found = usersList.find((p) => p.id === userId);
    if (found) {
      setCurrentUser(found);
      localStorage.setItem("medread_active_user_id", userId);
    }
  };

  const login = async (email: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setCurrentUser(data.user);
        localStorage.setItem("medread_active_user_id", data.user.id);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("medread_active_user_id");
    setCurrentUser(null);
  };

  const isAdmin = currentUser?.role === "admin";
  const isTeacher = currentUser?.role === "admin";
  const isStudent = currentUser?.role === "student";

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoaded,
        switchUser,
        login,
        logout,
        availableUsers: usersList,
        isAdmin,
        isTeacher,
        isStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

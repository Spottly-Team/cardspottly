"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getRedirectResult, onAuthStateChanged, signOut, type User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { signInWithApple, signInWithGoogle } from "@/lib/auth-sign-in";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signInGoogle: () => Promise<void>;
  signInApple: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    getRedirectResult(auth).catch(() => {
      /* errori redirect gestiti in /auth */
    });
    return onAuthStateChanged(auth, (next) => {
      setUser(next);
      setLoading(false);
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async signInGoogle() {
        await signInWithGoogle(getFirebaseAuth());
      },
      async signInApple() {
        await signInWithApple(getFirebaseAuth());
      },
      async logout() {
        await signOut(getFirebaseAuth());
      },
    }),
    [user, loading],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

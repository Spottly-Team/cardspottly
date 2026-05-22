"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import {
  completeGoogleRedirect,
  ensureAuthPersistence,
} from "@/lib/auth-bootstrap";
import { signInWithGoogle } from "@/lib/auth-sign-in";
import { getAuthErrorMessage } from "@/lib/auth-errors";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  /** true dopo getRedirectResult (OAuth redirect da mobile) */
  redirectHandled: boolean;
  redirectError: string | null;
  signInGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirectHandled, setRedirectHandled] = useState(false);
  const [redirectError, setRedirectError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getFirebaseAuth();
    let cancelled = false;

    void ensureAuthPersistence(auth);

    const unsubscribe = onAuthStateChanged(auth, (next) => {
      if (cancelled) return;
      setUser(next);
      setLoading(false);
    });

    void completeGoogleRedirect(auth)
      .catch((err) => {
        if (!cancelled) setRedirectError(getAuthErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setRedirectHandled(true);
      });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      redirectHandled,
      redirectError,
      async signInGoogle() {
        setRedirectError(null);
        await signInWithGoogle(getFirebaseAuth());
      },
      async logout() {
        await signOut(getFirebaseAuth());
      },
    }),
    [user, loading, redirectHandled, redirectError],
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

"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { takeAuthRedirect } from "@/lib/auth-redirect-storage";
import { resolvePostAuthPath } from "@/lib/post-auth-redirect";

/**
 * Esegue il redirect dopo login. Nessun ref "già partito": in React Strict Mode
 * il primo mount viene annullato e il secondo deve poter navigare.
 */
export function usePostAuthRedirect(onError: (message: string) => void) {
  const { user, loading, redirectHandled } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const redirectParam = params.get("redirect");

  useEffect(() => {
    if (loading || !redirectHandled || !user) return;

    let cancelled = false;
    const redirect = redirectParam ?? takeAuthRedirect();

    resolvePostAuthPath(user.uid, redirect)
      .then((path) => {
        if (!cancelled) router.replace(path);
      })
      .catch((err) => {
        if (!cancelled) {
          onError(
            err instanceof Error
              ? err.message
              : "Impossibile aprire il profilo. Riprova.",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user, loading, redirectHandled, router, redirectParam, onError]);
}

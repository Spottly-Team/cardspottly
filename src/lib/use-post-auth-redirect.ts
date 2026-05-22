"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { peekAuthRedirect, takeAuthRedirect } from "@/lib/auth-redirect-storage";
import { resolvePostAuthPath } from "@/lib/post-auth-redirect";

type Options = {
  /** false = non navigare */
  enabled?: boolean;
  /** Se non c'è redirect in URL/storage (es. pagina /auth dopo OAuth) */
  fallbackPath?: string;
};

/**
 * Redirect dopo login Google. Senza ref "già partito": in Strict Mode il primo
 * mount viene annullato e il secondo deve poter navigare.
 */
export function usePostAuthRedirect(
  onError: (message: string) => void,
  options?: Options,
) {
  const enabled = options?.enabled ?? true;
  const { user, loading, redirectHandled } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const redirectParam = params.get("redirect");

  useEffect(() => {
    if (!enabled || loading || !redirectHandled || !user) return;

    const stored = peekAuthRedirect();
    const pathToUse =
      redirectParam ?? (stored ? takeAuthRedirect() : null) ?? options?.fallbackPath;
    if (!pathToUse) return;

    let cancelled = false;

    resolvePostAuthPath(user.uid, pathToUse)
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
  }, [
    enabled,
    user,
    loading,
    redirectHandled,
    router,
    redirectParam,
    onError,
    options?.fallbackPath,
  ]);
}

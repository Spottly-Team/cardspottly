"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shell } from "@/components/ui/Shell";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/AuthProvider";

function AuthContent() {
  const { user, loading, signInGoogle, signInApple } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/me";
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.replace(redirect);
    }
  }, [user, loading, router, redirect]);

  async function handleSignIn(fn: () => Promise<void>) {
    setError(null);
    try {
      await fn();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Accesso non riuscito. Riprova.",
      );
    }
  }

  if (loading) {
    return (
      <Shell title="Accesso" subtitle="Caricamento...">
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-pulse rounded-full bg-white/20" />
        </div>
      </Shell>
    );
  }

  return (
    <Shell
      title="Accedi"
      subtitle="Usa Google o Apple per configurare e gestire la tua card."
    >
      <div className="flex flex-1 flex-col justify-center gap-4">
        <Button fullWidth onClick={() => handleSignIn(signInGoogle)}>
          Continua con Google
        </Button>
        <Button
          fullWidth
          variant="outline"
          onClick={() => handleSignIn(signInApple)}
        >
          Continua con Apple
        </Button>
        {error ? (
          <p className="rounded-xl border border-white/30 bg-white/5 px-4 py-3 text-sm text-white">
            {error}
          </p>
        ) : null}
      </div>
    </Shell>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <Shell title="Accesso" subtitle="Caricamento...">
          <div className="flex flex-1 items-center justify-center">
            <div className="h-8 w-8 animate-pulse rounded-full bg-white/20" />
          </div>
        </Shell>
      }
    >
      <AuthContent />
    </Suspense>
  );
}

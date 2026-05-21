"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shell } from "@/components/ui/Shell";
import { useAuth } from "@/components/AuthProvider";
import { GoogleIcon, AppleIcon } from "@/components/icons/AuthBrandIcons";

const PRIVACY_URL = "https://appspottly.com/privacypolicy";
const TERMS_URL = "https://appspottly.com/termini-condizioni";

function AuthFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 pt-6 pb-2 text-center">
      <p className="text-xs leading-relaxed text-neutral-500">
        <a
          href={PRIVACY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-white/30 underline-offset-2 transition hover:text-white"
        >
          Privacy Policy
        </a>
        <span className="mx-2 text-neutral-600">·</span>
        <a
          href={TERMS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-white/30 underline-offset-2 transition hover:text-white"
        >
          Termini e condizioni
        </a>
      </p>
    </footer>
  );
}

function AuthContent() {
  const { user, loading, signInGoogle, signInApple } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/me";
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"google" | "apple" | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.replace(redirect);
    }
  }, [user, loading, router, redirect]);

  async function handleSignIn(
    provider: "google" | "apple",
    fn: () => Promise<void>,
  ) {
    setError(null);
    setBusy(provider);
    try {
      await fn();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Accesso non riuscito. Riprova.",
      );
    } finally {
      setBusy(null);
    }
  }

  if (loading) {
    return (
      <Shell title="Accedi" subtitle="Caricamento...">
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
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex flex-1 flex-col justify-center gap-3">
          <button
            type="button"
            disabled={!!busy}
            onClick={() => handleSignIn("google", signInGoogle)}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-white px-6 text-sm font-semibold text-black transition active:scale-[0.98] disabled:opacity-60"
          >
            <GoogleIcon className="h-5 w-5 shrink-0" />
            <span>Continua con Google</span>
          </button>

          <button
            type="button"
            disabled={!!busy}
            onClick={() => handleSignIn("apple", signInApple)}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-full border-2 border-white bg-black px-6 text-sm font-semibold text-white transition active:scale-[0.98] disabled:opacity-60"
          >
            <AppleIcon className="h-5 w-5 shrink-0" />
            <span>Continua con Apple</span>
          </button>

          {error ? (
            <p className="rounded-xl border border-white/30 bg-white/5 px-4 py-3 text-sm text-white">
              {error}
            </p>
          ) : null}
        </div>

        <AuthFooter />
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

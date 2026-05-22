"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shell } from "@/components/ui/Shell";
import { useAuth } from "@/components/AuthProvider";
import { GoogleIcon } from "@/components/icons/AuthBrandIcons";
import { getAuthErrorCode, getAuthErrorMessage } from "@/lib/auth-errors";
import { takeAuthRedirect } from "@/lib/auth-redirect-storage";
import { resolvePostAuthPath } from "@/lib/post-auth-redirect";
import { LegalFooterLinks } from "@/components/LegalFooterLinks";

function AuthFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 pt-6 pb-2">
      <LegalFooterLinks />
    </footer>
  );
}

function AuthContent() {
  const { user, loading, redirectHandled, redirectError, signInGoogle } =
    useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const redirectParam = params.get("redirect");
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const postAuthStarted = useRef(false);

  useEffect(() => {
    if (redirectError) {
      setError(redirectError);
      setBusy(false);
    }
  }, [redirectError]);

  useEffect(() => {
    if (loading || !redirectHandled || !user || postAuthStarted.current) {
      return;
    }

    postAuthStarted.current = true;
    let cancelled = false;
    const redirect = redirectParam ?? takeAuthRedirect();

    resolvePostAuthPath(user.uid, redirect)
      .then((path) => {
        if (!cancelled) router.replace(path);
      })
      .catch((err) => {
        if (!cancelled) {
          setErrorCode(getAuthErrorCode(err));
          setError(
            getAuthErrorMessage(err) ||
              "Impossibile aprire il profilo. Riprova.",
          );
          postAuthStarted.current = false;
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user, loading, redirectHandled, router, redirectParam]);

  const completingSignIn =
    !loading && redirectHandled && !!user && !error;

  async function handleSignIn() {
    setError(null);
    setErrorCode(null);
    setBusy(true);
    try {
      await signInGoogle();
    } catch (err) {
      setErrorCode(getAuthErrorCode(err));
      setError(getAuthErrorMessage(err));
      setBusy(false);
    }
  }

  if (loading || !redirectHandled || completingSignIn) {
    return (
      <Shell
        title="Accedi"
        subtitle={
          completingSignIn
            ? "Accesso riuscito, reindirizzamento..."
            : "Caricamento..."
        }
      >
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-pulse rounded-full bg-white/20" />
        </div>
      </Shell>
    );
  }

  return (
    <Shell
      title="Accedi"
      subtitle="Usa Google per configurare e gestire la tua card."
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex flex-1 flex-col justify-center gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={handleSignIn}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-white px-6 text-sm font-semibold text-black transition active:scale-[0.98] disabled:opacity-60"
          >
            <GoogleIcon className="h-5 w-5 shrink-0" />
            <span>Continua con Google</span>
          </button>

          {error ? (
            <div className="rounded-xl border border-white/30 bg-white/5 px-4 py-3 text-sm text-white">
              <p className="whitespace-pre-line leading-relaxed">{error}</p>
              {errorCode ? (
                <p className="mt-2 font-mono text-xs text-neutral-500">
                  Codice Firebase: {errorCode}
                </p>
              ) : null}
            </div>
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

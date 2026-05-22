"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shell } from "@/components/ui/Shell";
import { useAuth } from "@/components/AuthProvider";
import { GoogleIcon } from "@/components/icons/AuthBrandIcons";
import { getAuthErrorCode, getAuthErrorMessage } from "@/lib/auth-errors";
import { usePostAuthRedirect } from "@/lib/use-post-auth-redirect";
import { LegalFooterLinks } from "@/components/LegalFooterLinks";
import { consumeOAuthStarted } from "@/lib/auth-sign-in";
import { takeAuthRedirect } from "@/lib/auth-redirect-storage";
import { resolvePostAuthPath } from "@/lib/post-auth-redirect";
import { getFirebaseAuth } from "@/lib/firebase";

function AuthFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 pt-6 pb-2">
      <LegalFooterLinks />
    </footer>
  );
}

function AuthContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, loading, redirectHandled, redirectError, signInGoogle } =
    useAuth();
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onRedirectError = useCallback((message: string) => {
    setError(message);
    setBusy(false);
  }, []);

  usePostAuthRedirect(onRedirectError, { fallbackPath: "/me" });

  useEffect(() => {
    if (redirectError) setError(redirectError);
  }, [redirectError]);

  useEffect(() => {
    if (!redirectHandled || loading || user) return;
    if (!consumeOAuthStarted()) return;
    setError(
      "Google non ha completato l'accesso. Tocca di nuovo «Continua con Google» (non chiudere la finestra). Se persiste, apri il sito in Safari o Chrome, non dall'anteprima Instagram.",
    );
    setBusy(false);
  }, [redirectHandled, loading, user]);

  const displayError = error ?? redirectError;
  const completingSignIn =
    !loading && redirectHandled && !!user && !displayError;

  useEffect(() => {
    if (!completingSignIn) return;
    const t = setTimeout(() => router.replace("/me"), 6000);
    return () => clearTimeout(t);
  }, [completingSignIn, router]);

  async function navigateAfterLogin(uid: string) {
    const redirect =
      params.get("redirect") ?? takeAuthRedirect() ?? "/me";
    const path = await resolvePostAuthPath(uid, redirect);
    router.replace(path);
  }

  async function handleSignIn() {
    setError(null);
    setErrorCode(null);
    setBusy(true);
    try {
      const cred = await signInGoogle();
      if (!cred) return;

      const uid = cred.user.uid ?? getFirebaseAuth().currentUser?.uid;
      if (uid) {
        await navigateAfterLogin(uid);
      }
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
            <span>{busy ? "Accesso in corso..." : "Continua con Google"}</span>
          </button>

          {displayError ? (
            <div className="rounded-xl border border-white/30 bg-white/5 px-4 py-3 text-sm text-white">
              <p className="whitespace-pre-line leading-relaxed">
                {displayError}
              </p>
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

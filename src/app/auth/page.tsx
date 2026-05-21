"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shell } from "@/components/ui/Shell";
import { useAuth } from "@/components/AuthProvider";
import { GoogleIcon } from "@/components/icons/AuthBrandIcons";
import { getFirebaseAuth } from "@/lib/firebase";
import { getAuthErrorCode, getAuthErrorMessage } from "@/lib/auth-errors";
import { resolvePostAuthPath } from "@/lib/post-auth-redirect";
import { LegalFooterLinks } from "@/components/LegalFooterLinks";
import { getRedirectResult } from "firebase/auth";

function AuthFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 pt-6 pb-2">
      <LegalFooterLinks />
    </footer>
  );
}

function AuthContent() {
  const { user, loading, signInGoogle } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const redirectParam = params.get("redirect");
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getRedirectResult(getFirebaseAuth())
      .then((result) => {
        if (result) {
          sessionStorage.removeItem("spottly_auth_redirect");
        }
      })
      .catch((err) => {
        setErrorCode(getAuthErrorCode(err));
        setError(getAuthErrorMessage(err));
        setBusy(false);
      });
  }, []);

  useEffect(() => {
    if (loading || !user) return;

    let cancelled = false;
    const redirect =
      redirectParam ??
      sessionStorage.getItem("spottly_auth_redirect");
    sessionStorage.removeItem("spottly_auth_redirect");

    resolvePostAuthPath(user.uid, redirect).then((path) => {
      if (!cancelled) router.replace(path);
    });

    return () => {
      cancelled = true;
    };
  }, [user, loading, router, redirectParam]);

  const completingSignIn = !loading && !!user;

  async function handleSignIn() {
    setError(null);
    setErrorCode(null);
    setBusy(true);
    try {
      await signInGoogle();
      // redirect: la pagina cambia; popup: resta busy finché user è valorizzato
    } catch (err) {
      setErrorCode(getAuthErrorCode(err));
      setError(getAuthErrorMessage(err));
      setBusy(false);
    }
  }

  if (loading || completingSignIn) {
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

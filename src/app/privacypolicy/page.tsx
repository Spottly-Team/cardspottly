import { readFileSync } from "fs";
import path from "path";
import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — Spottly Card",
  description:
    "Informativa sulla privacy di Spottly Card: dati raccolti, accesso con Google, GDPR e contatti.",
  alternates: { canonical: "/privacypolicy" },
};

function getPrivacyHtml() {
  return readFileSync(
    path.join(process.cwd(), "src/content/privacypolicy-body.html"),
    "utf-8",
  );
}

export default function PrivacyPolicyPage() {
  const html = getPrivacyHtml();

  return (
    <LegalPage
      title="Privacy Policy"
      updated="22 gennaio 2026"
      otherLegal={{
        href: "/termini-condizioni",
        label: "Termini e condizioni",
      }}
    >
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </LegalPage>
  );
}

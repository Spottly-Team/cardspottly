import { readFileSync } from "fs";
import path from "path";
import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Termini e Condizioni — Spottly Card",
  description:
    "Termini e condizioni d'uso del servizio Spottly Card e del sito card.appspottly.com.",
  alternates: { canonical: "/termini-condizioni" },
};

function getTermsHtml() {
  return readFileSync(
    path.join(process.cwd(), "src/content/termini-condizioni-body.html"),
    "utf-8",
  );
}

export default function TermsPage() {
  const html = getTermsHtml();

  return (
    <LegalPage
      title="Termini e Condizioni"
      updated="Gennaio 2026"
      otherLegal={{
        href: "/privacypolicy",
        label: "Privacy Policy",
      }}
    >
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </LegalPage>
  );
}

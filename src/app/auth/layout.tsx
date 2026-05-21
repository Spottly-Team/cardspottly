import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accedi",
  description:
    "Accedi a Spottly Card con Google o Apple per configurare e gestire la tua tessera NFC.",
  robots: { index: false, follow: false },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import { JsonLd } from "@/components/JsonLd";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  "https://card.appspottly.com";

const siteName = "Spottly Card";
const defaultTitle = "Spottly Card — La tua tessera NFC";
const defaultDescription =
  "Configura la tessera NFC Spottly: condividi profilo, social e sconti nei locali partner. Scansiona, accedi con Google e attiva la tua card in pochi secondi.";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  keywords: [
    "Spottly",
    "Spottly Card",
    "tessera NFC",
    "card NFC",
    "profilo NFC",
    "spotted studenti",
    "tessera studenti",
    "sconti locali",
    "partner Spottly",
  ],
  authors: [{ name: "Spottly" }],
  creator: "Spottly",
  publisher: "Spottly",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: siteUrl,
    siteName,
    title: "Spottly Card — Condividi il tuo profilo con un tap",
    description:
      "Attiva la tua tessera NFC Spottly: profilo, Instagram, TikTok e sconti nei locali partner.",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "Spottly Card",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Spottly Card — La tua tessera NFC",
    description:
      "Configura la tessera NFC Spottly e mostra il tuo profilo quando qualcuno la scansiona.",
    images: ["/android-chrome-512x512.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    title: siteName,
    statusBarStyle: "black-translucent",
  },
  category: "social",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#5c59a3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="bg-black">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${geistSans.variable} bg-black text-white antialiased`}>
        <JsonLd />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

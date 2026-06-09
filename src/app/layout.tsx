import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "900"],
});

export const metadata: Metadata = {
  title: "DreamPageStudio — Strony internetowe dla firm od 599 zł",
  description:
    "Profesjonalne strony internetowe dla małych firm w Polsce. Gotowe w 48h, od 599 zł. Napisz na WhatsApp.",
  openGraph: {
    title: "DreamPageStudio — Strony internetowe dla firm od 599 zł",
    description:
      "Profesjonalne strony internetowe dla małych firm w Polsce. Gotowe w 48h, od 599 zł.",
    type: "website",
    locale: "pl_PL",
  },
  metadataBase: new URL("https://dreampagestudio.pl"),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${geist.variable} ${playfair.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
    <html lang="pl" className={`${geist.variable} h-full`}>
      <body className="min-h-full antialiased">
        {children}
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
          document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init','1522294435703931');fbq('track','PageView');
        `}</Script>
      </body>
    </html>
  );
}

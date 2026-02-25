import type { Metadata } from "next";
import { Geist_Mono, Noto_Sans_Hebrew, Roboto } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";

const notoSansHebrew = Noto_Sans_Hebrew({
  variable: "--font-noto-sans-hebrew",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Halacha.ai - Accurate Answers from Original Sources",
  description: "Ask Halachic questions and receive answers grounded in Shulchan Aruch, Mishnah Berurah, and authoritative texts.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <body
        dir="rtl"
        className={`${notoSansHebrew.variable} ${roboto.variable} ${geistMono.variable} font-sans antialiased`}
        style={{ fontFamily: "var(--font-noto-sans-hebrew), 'Noto Sans Hebrew', system-ui, sans-serif" }}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}

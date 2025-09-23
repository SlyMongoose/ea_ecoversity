import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Ea Ecoversity - ʻŌlelo Hawaiʻi Learning Platform",
  description: "A submersive sandbox educational environment for learning ʻŌlelo Hawaiʻi and Hawaiian knowledge systems",
  keywords: ["Hawaiian", "ʻŌlelo Hawaiʻi", "cultural education", "language learning", "Hawaiian culture"],
  authors: [{ name: "Ea Ecoversity" }],
  openGraph: {
    title: "Ea Ecoversity - Hawaiian Cultural Learning",
    description: "Learn ʻŌlelo Hawaiʻi through cultural stories, place-based knowledge, and community connection",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-hawaiian antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Github Galaxy",
  description: "Github in 3D",
  keywords: ["Github", "Explore"],
  authors: [{ name: "CosmicCrusader23" }],
  icons: {
  },
  openGraph: {
    title: "Github Galaxy",
    description: "Github in 3D",
    url: "https://githubgalaxy.vercel.app/",
    siteName: "Github Galaxy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Github Galaxy",
    description: "Github in 3D",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

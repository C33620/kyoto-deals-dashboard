import MobileShell from "@/components/layout/MobileShell";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Kyoto Deals — Business Dashboard",
  description: "Promote your café, bakery, or restaurant to tourists nearby.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <MobileShell>{children}</MobileShell>
      </body>
    </html>
  );
}

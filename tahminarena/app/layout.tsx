import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import BottomMenu from "@/components/layout/BottomMenu";

export const metadata: Metadata = {
  title: "TahminArena",
  description: "Sosyal futbol tahmin platformu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        <Header />

        <div className="app-content">{children}</div>

        <BottomMenu />
      </body>
    </html>
  );
}
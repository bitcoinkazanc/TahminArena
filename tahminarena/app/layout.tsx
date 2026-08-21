import type { Metadata } from "next";

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
      <body>{children}</body>
    </html>
  );
}
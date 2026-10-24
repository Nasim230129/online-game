import type { Metadata } from "next";
import "./globals.css";
import { Header, Footer } from "@/components/Navigation";

export const metadata: Metadata = {
  title: {
    template: "%s | PlayNest",
    default: "PlayNest - Find your next favourite game",
  },
  description: "PlayNest is a fast, responsive browser gaming portal offering free instant-play HTML5 games without downloads.",
  keywords: ["free browser games", "online games", "HTML5 games", "puzzle games", "arcade games"],
  authors: [{ name: "PlayNest Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-navy-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-cyan-500 selection:text-navy-950">
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

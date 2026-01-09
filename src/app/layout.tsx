import type { Metadata } from "next";
import { Inter, Cinzel, Libre_Baskerville } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });
const libreBaskerville = Libre_Baskerville({ 
  weight: ['400', '700', '400'], 
  subsets: ["latin"], 
  variable: "--font-libre",
  style: ['normal', 'italic']
});

export const metadata: Metadata = {
  title: "The Living Word - Biblia Espacial Inmersiva",
  description: "Navega a través de la Biblia en una experiencia 3D dinámica y espacial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`dark ${inter.variable} ${cinzel.variable} ${libreBaskerville.variable}`}>
      <body className={inter.className}>
        <Providers>
          <div className="relative min-h-screen bg-black overflow-hidden">
            {/* Ambient Background Layer */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1),rgba(0,0,0,1))]" />
            </div>
            <main className="relative z-10">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}

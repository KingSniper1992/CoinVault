import type { Metadata } from "next";
import { Press_Start_2P, Plus_Jakarta_Sans, Chakra_Petch, Silkscreen } from "next/font/google";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  weight: "400",
  variable: "--font-pixel",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const chakraPetch = Chakra_Petch({
  weight: ["500", "600", "700"],
  variable: "--font-chakra",
  subsets: ["latin"],
});

const silkscreen = Silkscreen({
  weight: ["400", "700"],
  variable: "--font-silkscreen",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coin Vault",
  description: "Coin Vault - Iniciar Sesión",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${pressStart2P.variable} ${plusJakartaSans.variable} ${chakraPetch.variable} ${silkscreen.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans text-slate-800 overflow-x-hidden select-none bg-[url('/images/bg.png')] bg-cover bg-center bg-fixed bg-no-repeat bg-[#f1f5f9]">
        {children}
      </body>
    </html>
  );
}

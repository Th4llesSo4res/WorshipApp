// src/app/layout.jsx
import { Geist, Geist_Mono } from "next/font/google"; // Suas fontes Geist
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext"; // Importa o AuthProvider

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "WorshipApp - Gestão de Equipe de Louvor", // Título atualizado
  description: "App para organização de escalas, repertório e ensaios.", // Descrição atualizada
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR"> {/* Alterado para pt-BR para consistência */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Envolve toda a aplicação com o AuthProvider */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
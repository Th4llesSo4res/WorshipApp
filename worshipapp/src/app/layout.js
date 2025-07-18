// src/app/layout.jsx
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/ToastNotification"; // <--- NOVO: Importa o ToastProvider
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "WorshipApp - Gestão de Equipe de Louvor",
  description: "App para organização de escalas, repertório e ensaios.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex`}>
        <AuthProvider>
          {/* O ToastProvider deve envolver o conteúdo que pode disparar toasts */}
          <ToastProvider> {/* <--- NOVO: Envolve o conteúdo aqui */}
            <Sidebar />
            <main className="flex-1 ml-64">
              {children}
            </main>
          </ToastProvider> {/* <--- NOVO: Fecha o ToastProvider aqui */}
        </AuthProvider>
      </body>
    </html>
  );
}
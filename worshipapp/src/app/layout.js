// src/app/layout.jsx
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar"; // <--- NOVO: Importa o Sidebar

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex`}> {/* <--- NOVO: Adiciona 'flex' aqui */}
        <AuthProvider>
          {/* Renderiza o Sidebar */}
          <Sidebar /> 
          {/* O conteúdo da página ficará à direita do Sidebar */}
          <main className="flex-1 ml-64"> {/* <--- NOVO: Adiciona 'ml-64' para dar espaço ao sidebar */}
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
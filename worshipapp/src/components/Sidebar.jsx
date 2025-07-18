// src/components/Sidebar.jsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // Para pegar o usuário e o papel
import { auth } from "@/lib/firebase"; // Para a função de logout

export default function Sidebar() {
  const { currentUser, role, loading } = useAuth();
  const router = useRouter();

  // Se ainda está carregando o usuário/papel, ou não tem usuário, não mostra o sidebar ainda
  if (loading || !currentUser) {
    return null; // Ou um spinner de carregamento, se preferir
  }

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      alert("Erro ao fazer logout. Tente novamente.");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-white w-64 p-4 shadow-lg fixed top-0 left-0">
      <div className="text-2xl font-bold mb-8 text-center border-b border-gray-700 pb-4">
        WorshipApp
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {/* Link para o Dashboard (visível para todos logados) */}
          <li>
            <Link href="/dashboard" className="block py-2 px-4 rounded hover:bg-gray-700">
              Dashboard
            </Link>
          </li>

          {/* Link para Cadastro de Usuário (APENAS para Líder) */}
          {role === 'lider' && (
            <li>
              <Link href="/cadastro" className="block py-2 px-4 rounded hover:bg-gray-700">
                Cadastro de Usuário
              </Link>
            </li>
          )}

          {/* Links para Módulos (Visíveis para Líder, Ministro, Músico) */}
          {/* Apenas Músico é 'musico', os outros dois são 'lider' ou 'ministro' */}
          {(role === 'lider' || role === 'ministro' || role === 'musico') && (
            <>
              <li>
                <Link href="/escalas/lista" className="block py-2 px-4 rounded hover:bg-gray-700">
                  Escalas
                </Link>
              </li>
              <li>
                <Link href="/repertorios/lista" className="block py-2 px-4 rounded hover:bg-gray-700">
                  Repertórios
                </Link>
              </li>
              <li>
                <Link href="/ensaios/lista" className="block py-2 px-4 rounded hover:bg-gray-700">
                  Ensaios
                </Link>
              </li>
              {/* Adicionar aqui links para outros módulos visíveis a todos se houver */}
            </>
          )}
        </ul>
      </nav>

      {/* Botão de Logout na parte inferior do Sidebar */}
      <div className="mt-auto pt-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          Sair
        </button>
      </div>
    </div>
  );
}
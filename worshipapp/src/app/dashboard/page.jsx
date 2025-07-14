// src/app/dashboard/page.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // Importa o useAuth hook
import { auth } from "@/lib/firebase"; // Importa 'auth' para o logout

export default function DashboardPage() {
  const router = useRouter();
  const { currentUser, role, loading } = useAuth(); // Pega o usuário, papel e estado de carregamento do contexto

  useEffect(() => {
    // Se o carregamento ainda está acontecendo, não faz nada
    if (loading) return;

    // Se não há usuário logado (e o carregamento terminou), redireciona para o login
    if (!currentUser) {
      router.push("/login");
    } else {
      // Opcional: Logar o papel do usuário para verificar no console
      console.log("Usuário logado:", currentUser.email, "Papel:", role);
      // Aqui você poderia, no futuro, redirecionar com base no papel
      // Ex: if (role === 'musico') router.push('/musico/dashboard');
    }
  }, [currentUser, loading, role, router]); // Adiciona 'role' e 'loading' às dependências

  const handleLogout = async () => {
    try {
      await auth.signOut(); // Desloga do Firebase Authentication
      router.push("/login"); // Redireciona para a página de login
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      alert("Erro ao fazer logout. Tente novamente.");
    }
  };

  // Exibe mensagem de carregamento enquanto o contexto está sendo inicializado
  if (loading) {
    return <p className="text-center mt-10">Carregando dashboard...</p>;
  }

  // Se não há usuário após o carregamento, não renderiza nada (já vai redirecionar)
  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="mb-2">Bem-vindo, <strong>{currentUser.email}</strong></p>
        <p className="mb-6">Seu papel: <strong>{role ? role.toUpperCase() : 'Não Definido'}</strong></p>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
        >
          Sair
        </button>
      </div>
    </div>
  );
}
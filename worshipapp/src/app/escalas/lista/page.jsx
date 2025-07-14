// src/app/escalas/lista/page.jsx
"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // <--- 1. NOVO: Importa o useAuth

export default function ListaEscalas() {
  const [escalas, setEscalas] = useState([]);
  const [loading, setLoading] = useState(true); // Alterado para true para refletir carregamento inicial
  const [mensagem, setMensagem] = useState(""); // Adicionado estado de mensagem para feedback
  const router = useRouter();
  const { role, loading: authLoading } = useAuth(); // <--- 2. NOVO: Pega o role e authLoading do AuthContext

  async function carregarEscalas() {
    setLoading(true);
    setMensagem(""); // Limpa mensagens anteriores
    try {
      const ref = collection(db, "escalas");
      const q = query(ref, orderBy("data", "asc"));
      const snapshot = await getDocs(q);

      const dados = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setEscalas(dados);
    } catch (error) {
      console.error("Erro ao carregar escalas:", error);
      setMensagem("Erro ao carregar escalas. Por favor, tente novamente.");
    }
    setLoading(false);
  }

  useEffect(() => {
    // <--- 3. NOVO: Garante que o papel do usuário já foi carregado antes de carregar as escalas
    if (!authLoading) {
      carregarEscalas();
    }
  }, [authLoading]); // Depende do estado de carregamento da autenticação

  async function excluirEscala(id) {
    const confirmar = window.confirm("Tem certeza que deseja excluir esta escala?");
    if (!confirmar) return;

    setMensagem(""); // Limpa mensagens anteriores
    try {
      await deleteDoc(doc(db, "escalas", id));
      setMensagem("✅ Escala excluída com sucesso!");
      carregarEscalas();
    } catch (error) {
      setMensagem("❌ Erro ao excluir: " + error.message);
      console.error("Erro ao excluir escala:", error);
    }
  }

  // <--- 4. NOVO: Variável para determinar se o usuário pode editar/excluir/criar
  const canManageEscalas = role === 'lider' || role === 'ministro';

  // <--- 5. NOVO: Carregamento combinado (do AuthContext e da lista)
  if (loading || authLoading) {
    return <p className="p-4 text-center">Carregando escalas...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-6 max-w-4xl mx-auto flex justify-between items-center">
        📅 Escalas Cadastradas
        {/* <--- 5. NOVO: Mostra o botão "Nova Escala" apenas se canManageEscalas for true */}
        {canManageEscalas && (
          <button
            onClick={() => router.push("/escalas/cadastro")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            + Nova Escala
          </button>
        )}
      </h1>

      <div className="max-w-4xl mx-auto space-y-6">
        {mensagem && <p className="text-center mt-4" style={{ color: mensagem.startsWith('✅') ? 'green' : 'red' }}>{mensagem}</p>}

        {escalas.length === 0 && (
          <p className="text-center text-gray-600">Nenhuma escala cadastrada ainda.</p>
        )}

        {escalas.map((escala) => (
          <div
            key={escala.id}
            className="bg-white rounded shadow p-6 flex flex-col md:flex-row md:justify-between items-start md:items-center"
          >
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Culto: {new Date(escala.data).toLocaleDateString()}
              </h2>
              <p><strong>Vocal:</strong> {escala.vocal.join(", ")}</p>
              <p><strong>Guitarra:</strong> {escala.guitarra.join(", ")}</p>
              <p><strong>Teclado:</strong> {escala.teclado.join(", ")}</p>
              <p><strong>Bateria:</strong> {escala.bateria.join(", ")}</p>
            </div>

            {/* <--- 5. NOVO: Mostra os botões "Editar" e "Excluir" apenas se canManageEscalas for true */}
            {canManageEscalas && (
              <div className="flex gap-2 mt-4 md:mt-0">
                <button
                  onClick={() => router.push(`/escalas/editar/${escala.id}`)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white rounded px-4 py-2"
                >
                  Editar
                </button>

                <button
                  onClick={() => excluirEscala(escala.id)}
                  className="bg-red-600 hover:bg-red-700 text-white rounded px-4 py-2"
                >
                  Excluir
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
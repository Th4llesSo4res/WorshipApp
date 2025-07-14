// src/app/ensaios/lista/page.jsx
"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // <--- 1. NOVO: Importa o useAuth

export default function ListaEnsaios() {
  const [ensaios, setEnsaios] = useState([]);
  const [loading, setLoading] = useState(true); // Alterado para true para refletir carregamento inicial
  const [mensagem, setMensagem] = useState(""); // Estado para mensagens de sucesso/erro
  const router = useRouter();
  const { role, loading: authLoading } = useAuth(); // <--- 2. NOVO: Pega o role e authLoading do AuthContext

  // Função para carregar os ensaios do Firebase
  async function carregarEnsaios() {
    setLoading(true);
    setMensagem(""); // Limpa mensagens anteriores
    try {
      const ensaiosRef = collection(db, "ensaios");
      const q = query(ensaiosRef, orderBy("data", "asc"), orderBy("hora", "asc"));
      const snapshot = await getDocs(q);

      const dadosEnsaios = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEnsaios(dadosEnsaios);
    } catch (error) {
      console.error("Erro ao carregar ensaios:", error);
      setMensagem("Erro ao carregar ensaios. Por favor, tente novamente.");
    }
    setLoading(false);
  }

  useEffect(() => {
    // <--- 3. NOVO: Garante que o papel do usuário já foi carregado antes de carregar os ensaios
    if (!authLoading) {
      carregarEnsaios();
    }
  }, [authLoading]); // Depende do estado de carregamento da autenticação

  // Função para excluir um ensaio
  async function excluirEnsaio(id) {
    const confirmar = window.confirm("Tem certeza que deseja excluir este ensaio?");
    if (!confirmar) return;

    setMensagem(""); // Limpa mensagens anteriores
    try {
      await deleteDoc(doc(db, "ensaios", id));
      setMensagem("✅ Ensaio excluído com sucesso!");
      carregarEnsaios();
    } catch (error) {
      setMensagem("❌ Erro ao excluir ensaio: " + error.message);
      console.error("Erro ao excluir ensaio:", error);
    }
  }

  // <--- 4. NOVO: Variável para determinar se o usuário pode gerenciar ensaios
  const canManageEnsaios = role === 'lider' || role === 'ministro';

  // <--- 5. NOVO: Carregamento combinado (do AuthContext e da lista)
  if (loading || authLoading) {
    return <p className="p-4 text-center">Carregando ensaios...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-6 max-w-4xl mx-auto flex justify-between items-center">
        🗓️ Ensaios Agendados
        {/* <--- 5. NOVO: Mostra o botão "Novo Ensaio" apenas se canManageEnsaios for true */}
        {canManageEnsaios && (
          <button
            onClick={() => router.push("/ensaios/cadastro")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            + Novo Ensaio
          </button>
        )}
      </h1>

      <div className="max-w-4xl mx-auto space-y-6">
        {mensagem && <p className="text-center mt-4" style={{ color: mensagem.startsWith('✅') ? 'green' : 'red' }}>{mensagem}</p>}

        {!loading && ensaios.length === 0 && (
          <p className="text-center text-gray-600">Nenhum ensaio agendado ainda.</p>
        )}

        {!loading && ensaios.map((ensaio) => (
          <div key={ensaio.id} className="bg-white rounded shadow p-6 flex flex-col md:flex-row md:justify-between items-start md:items-center">
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Data: {new Date(ensaio.data + 'T' + ensaio.hora).toLocaleDateString('pt-BR')} às {ensaio.hora}
              </h2>
              <p><strong>Local:</strong> {ensaio.local}</p>
              {ensaio.observacoes && <p><strong>Observações:</strong> {ensaio.observacoes}</p>}
            </div>

            {/* <--- 5. NOVO: Mostra os botões "Editar" e "Excluir" apenas se canManageEnsaios for true */}
            {canManageEnsaios && (
              <div className="flex gap-2 mt-4 md:mt-0">
                <button
                  onClick={() => router.push(`/ensaios/editar/${ensaio.id}`)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => excluirEnsaio(ensaio.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
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
// src/app/escalas/lista/page.jsx
"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ToastNotification"; // Importa o useToast

export default function ListaEscalas() {
  const [escalas, setEscalas] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [mensagem, setMensagem] = useState(""); // Removido
  const router = useRouter();
  const { role, loading: authLoading } = useAuth();
  const { addToast } = useToast(); // Obtém a função addToast

  async function carregarEscalas() {
    setLoading(true);
    // setMensagem(""); // Removido
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
      addToast("Erro ao carregar escalas. Por favor, tente novamente.", "error"); // Usa addToast
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!authLoading) {
      carregarEscalas();
    }
  }, [authLoading]);

  async function excluirEscala(id) {
    const confirmar = window.confirm("Tem certeza que deseja excluir esta escala?");
    if (!confirmar) return;

    // setMensagem(""); // Removido
    try {
      await deleteDoc(doc(db, "escalas", id));
      addToast("Escala excluída com sucesso!", "success"); // Usa addToast
      carregarEscalas();
    } catch (error) {
      addToast("Erro ao excluir: " + error.message, "error"); // Usa addToast
      console.error("Erro ao excluir escala:", error);
    }
  }

  // Permissão para CRIAR novas escalas (APENAS Líder)
  const canCreateEscalas = role === 'lider';
  // Permissão para EDITAR ou EXCLUIR escalas (APENAS Líder)
  const canEditOrDeleteEscalas = role === 'lider';

  if (loading || authLoading) {
    return <p className="p-4 text-center">Carregando escalas...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-6 max-w-4xl mx-auto flex justify-between items-center">
        📅 Escalas Cadastradas
        {canCreateEscalas && (
          <button
            onClick={() => router.push("/escalas/cadastro")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            + Nova Escala
          </button>
        )}
      </h1>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* <p> de mensagem removido */}

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

            {canEditOrDeleteEscalas && (
              <div className="flex gap-2 mt-4 md:mt-0">
                <button
                  onClick={() => router.push(`/escalas/editar/${escala.id}`)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => excluirEscala(escala.id)}
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

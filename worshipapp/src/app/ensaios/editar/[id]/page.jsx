// src/app/ensaios/editar/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import usePermission from "@/hooks/usePermission"; // Importa o hook de permissão
import { useToast } from "@/components/ToastNotification"; // Importa o useToast

export default function EditarEnsaioPage() {
  // Apenas 'lider' e 'ministro' podem acessar
  usePermission(['lider', 'ministro']);

  const { id } = useParams();
  const router = useRouter();
  const { addToast } = useToast(); // Obtém a função addToast

  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [local, setLocal] = useState("");
  const [observacoes, setObservacoes] = useState("");
  // const [mensagem, setMensagem] = useState(""); // Removido
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarEnsaio() {
      if (!id) return;
      setLoading(true);
      // setMensagem(""); // Removido
      try {
        const docRef = doc(db, "ensaios", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const dadosEnsaio = docSnap.data();
          setData(dadosEnsaio.data || "");
          setHora(dadosEnsaio.hora || "");
          setLocal(dadosEnsaio.local || "");
          setObservacoes(dadosEnsaio.observacoes || "");
        } else {
          addToast("Ensaio não encontrado.", "error");
          // Opcional: redirecionar se o ensaio não for encontrado
          // router.push("/ensaios/lista");
        }
      } catch (error) {
        addToast("Erro ao carregar ensaio: " + error.message, "error");
        console.error("Erro ao carregar ensaio:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarEnsaio();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    // setMensagem(""); // Removido

    if (!data || !hora || !local) {
      addToast("Por favor, preencha a data, hora e local do ensaio.", "error");
      return;
    }

    try {
      const docRef = doc(db, "ensaios", id);
      await updateDoc(docRef, {
        data,
        hora,
        local,
        observacoes,
      });

      addToast("Ensaio atualizado com sucesso!", "success");
      setTimeout(() => router.push("/ensaios/lista"), 1500);
    } catch (error) {
      addToast("Erro ao atualizar ensaio: " + error.message, "error");
      console.error("Erro ao atualizar ensaio:", error);
    }
  }

  if (loading) {
    return <p className="p-4 text-center">Carregando ensaio...</p>;
  }

  if (!data && !hora && !local && !observacoes && !loading) { // Verifica se não carregou dados e não está mais carregando
    return <p className="p-4 text-center text-red-600">Ensaio não encontrado ou erro ao carregar.</p>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Editar Ensaio</h1>

        {/* <p> de mensagem removido */}

        <label className="block mb-2 font-semibold">Data:</label>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          required
        />

        <label className="block mb-2 font-semibold">Hora:</label>
        <input
          type="time"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          required
        />

        <label className="block mb-2 font-semibold">Local:</label>
        <input
          type="text"
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          placeholder="Ex: Igreja Matriz, Salão Paroquial"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          required
        />

        <label className="block mb-2 font-semibold">Observações (Opcional):</label>
        <textarea
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          rows="4"
          placeholder="Ex: Levar violão, ensaio focado em músicas novas..."
          className="w-full p-2 mb-6 border border-gray-300 rounded"
        ></textarea>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded"
        >
          Atualizar Ensaio
        </button>
      </form>
    </div>
  );
}

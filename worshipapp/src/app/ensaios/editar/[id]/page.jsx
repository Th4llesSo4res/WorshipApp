// src/app/ensaios/editar/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function EditarEnsaioPage() {
  usePermission(['lider', 'ministro']);
  const { id } = useParams(); // Pega o ID do ensaio da URL
  const router = useRouter();

  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [local, setLocal] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarEnsaio() {
      if (!id) return; // Garante que o ID existe antes de buscar

      const docRef = doc(db, "ensaios", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const dadosEnsaio = docSnap.data();
        setData(dadosEnsaio.data || "");
        setHora(dadosEnsaio.hora || "");
        setLocal(dadosEnsaio.local || "");
        setObservacoes(dadosEnsaio.observacoes || "");
      } else {
        setMensagem("Ensaio não encontrado.");
      }
      setLoading(false);
    }
    carregarEnsaio();
  }, [id]); // Dependência do useEffect para recarregar se o ID mudar

  async function handleSubmit(e) {
    e.preventDefault();
    setMensagem("");

    if (!data || !hora || !local) {
      setMensagem("Por favor, preencha a data, hora e local do ensaio.");
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

      setMensagem("✅ Ensaio atualizado com sucesso!");
      setTimeout(() => router.push("/ensaios/lista"), 1500); // Redireciona para a lista após 1.5s
    } catch (error) {
      setMensagem("❌ Erro ao atualizar ensaio: " + error.message);
      console.error("Erro ao atualizar ensaio:", error);
    }
  }

  if (loading) {
    return <p className="p-4 text-center">Carregando ensaio...</p>;
  }

  if (mensagem === "Ensaio não encontrado.") {
    return <p className="p-4 text-center text-red-600">{mensagem}</p>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Editar Ensaio</h1>

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

        {mensagem && <p className="mt-4 text-center">{mensagem}</p>}
      </form>
    </div>
  );
}
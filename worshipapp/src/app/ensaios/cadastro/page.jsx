// src/app/ensaios/cadastro/page.jsx
"use client";

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import usePermission from "@/hooks/usePermission"; // Importa o hook de permissão
import { useToast } from "@/components/ToastNotification"; // Importa o useToast

export default function CadastroEnsaio() {
  // Apenas 'lider' e 'ministro' podem acessar
  usePermission(['lider', 'ministro']);

  const router = useRouter();
  const { addToast } = useToast(); // Obtém a função addToast

  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [local, setLocal] = useState("");
  const [observacoes, setObservacoes] = useState("");
  // const [mensagem, setMensagem] = useState(""); // Removido

  async function handleSubmit(e) {
    e.preventDefault();
    // setMensagem(""); // Removido

    if (!data || !hora || !local) {
      addToast("Por favor, preencha a data, hora e local do ensaio.", "error");
      return;
    }

    try {
      await addDoc(collection(db, "ensaios"), {
        data,
        hora,
        local,
        observacoes,
        criadoEm: new Date().toISOString(),
      });

      addToast("Ensaio agendado com sucesso!", "success");
      setData("");
      setHora("");
      setLocal("");
      setObservacoes("");
      
      setTimeout(() => router.push("/ensaios/lista"), 1500);
    } catch (error) {
      addToast("Erro ao agendar ensaio: " + error.message, "error");
      console.error("Erro ao agendar ensaio:", error);
    }
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Agendar Ensaio</h1>

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
          Agendar Ensaio
        </button>

        {/* <p> de mensagem removido */}
      </form>
    </div>
  );
}

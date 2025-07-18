// src/app/escalas/cadastro/page.jsx
"use client";

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import usePermission from "@/hooks/usePermission";
import { useToast } from "@/components/ToastNotification"; // Importa o useToast

export default function CadastroEscala() {
  // Apenas 'lider' pode criar escalas
  usePermission(['lider']); 

  const [data, setData] = useState("");
  const [vocal, setVocal] = useState("");
  const [guitarra, setGuitarra] = useState("");
  const [teclado, setTeclado] = useState("");
  const [bateria, setBateria] = useState("");
  // const [mensagem, setMensagem] = useState(""); // Removido
  const router = useRouter();
  const { addToast } = useToast(); // Obtém a função addToast

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setMensagem(""); // Removido

    if (!data || !vocal) {
      addToast("Por favor, preencha a data e o vocal.", "error");
      return;
    }

    try {
      await addDoc(collection(db, "escalas"), {
        data,
        vocal: vocal.split(",").map((nome) => nome.trim()),
        guitarra: guitarra.split(",").map((nome) => nome.trim()),
        teclado: teclado.split(",").map((nome) => nome.trim()),
        bateria: bateria.split(",").map((nome) => nome.trim()),
        criadoEm: new Date(),
      });
      addToast("Escala cadastrada com sucesso!", "success");
      setData("");
      setVocal("");
      setGuitarra("");
      setTeclado("");
      setBateria("");
      // Opcional: redirecionar para a lista de escalas após o cadastro
      // router.push("/escalas/lista");
    } catch (error) {
      addToast("Erro ao salvar escala: " + error.message, "error");
      console.error("Erro ao salvar escala:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Cadastrar Escala</h2>

        <label className="block mb-2 font-semibold">Data do culto:</label>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          required
        />

        <label className="block mb-2 font-semibold">Vocal (separe por vírgula):</label>
        <input
          type="text"
          value={vocal}
          onChange={(e) => setVocal(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />

        <label className="block mb-2 font-semibold">Guitarra:</label>
        <input
          type="text"
          value={guitarra}
          onChange={(e) => setGuitarra(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />

        <label className="block mb-2 font-semibold">Teclado:</label>
        <input
          type="text"
          value={teclado}
          onChange={(e) => setTeclado(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />

        <label className="block mb-2 font-semibold">Bateria:</label>
        <input
          type="text"
          value={bateria}
          onChange={(e) => setBateria(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white w-full p-2 rounded"
        >
          Salvar Escala
        </button>

        {/* <p> de mensagem removido */}
      </form>
    </div>
  );
}

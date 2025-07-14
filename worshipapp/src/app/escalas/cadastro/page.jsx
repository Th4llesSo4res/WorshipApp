// src/app/escalas/page.jsx
"use client";

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function EscalasPage() {
 usePermission(['lider', 'ministro']);
  const [data, setData] = useState("");
  const [vocal, setVocal] = useState("");
  const [guitarra, setGuitarra] = useState("");
  const [teclado, setTeclado] = useState("");
  const [bateria, setBateria] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");

    try {
      await addDoc(collection(db, "escalas"), {
        data,
        vocal: vocal.split(",").map((nome) => nome.trim()),
        guitarra: guitarra.split(",").map((nome) => nome.trim()),
        teclado: teclado.split(",").map((nome) => nome.trim()),
        bateria: bateria.split(",").map((nome) => nome.trim()),
        criadoEm: new Date(),
      });

      setMensagem("✅ Escala cadastrada com sucesso!");
      setData("");
      setVocal("");
      setGuitarra("");
      setTeclado("");
      setBateria("");
    } catch (error) {
      setMensagem("❌ Erro ao salvar: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Cadastrar Escala</h2>

        <label>Data do culto:</label>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          required
        />

        <label>Vocal (separe por vírgula):</label>
        <input
          type="text"
          value={vocal}
          onChange={(e) => setVocal(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />

        <label>Guitarra:</label>
        <input
          type="text"
          value={guitarra}
          onChange={(e) => setGuitarra(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />

        <label>Teclado:</label>
        <input
          type="text"
          value={teclado}
          onChange={(e) => setTeclado(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />

        <label>Bateria:</label>
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

        {mensagem && <p className="mt-4 text-center">{mensagem}</p>}
      </form>
    </div>
  );
}

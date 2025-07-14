// src/app/escalas/editar/[id]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function EditarEscala() {
  const { id } = useParams();
  const router = useRouter();

  const [escala, setEscala] = useState(null);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    async function buscarEscala() {
      const ref = doc(db, "escalas", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setEscala(snap.data());
      } else {
        setMensagem("Escala não encontrada.");
      }
    }

    buscarEscala();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");

    try {
      await updateDoc(doc(db, "escalas", id), {
        data: escala.data,
        vocal: escala.vocal.split(",").map((nome) => nome.trim()),
        guitarra: escala.guitarra.split(",").map((nome) => nome.trim()),
        teclado: escala.teclado.split(",").map((nome) => nome.trim()),
        bateria: escala.bateria.split(",").map((nome) => nome.trim()),
      });

      setMensagem("✅ Escala atualizada com sucesso!");
      setTimeout(() => router.push("/escalas/lista"), 1500);
    } catch (error) {
      setMensagem("❌ Erro ao atualizar: " + error.message);
    }
  };

  if (!escala) return <p className="p-4">Carregando...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Editar Escala</h2>

        <label>Data do culto:</label>
        <input
          type="date"
          value={escala.data}
          onChange={(e) => setEscala({ ...escala, data: e.target.value })}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />

        <label>Vocal:</label>
        <input
          type="text"
          value={escala.vocal}
          onChange={(e) => setEscala({ ...escala, vocal: e.target.value })}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />

        <label>Guitarra:</label>
        <input
          type="text"
          value={escala.guitarra}
          onChange={(e) => setEscala({ ...escala, guitarra: e.target.value })}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />

        <label>Teclado:</label>
        <input
          type="text"
          value={escala.teclado}
          onChange={(e) => setEscala({ ...escala, teclado: e.target.value })}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />

        <label>Bateria:</label>
        <input
          type="text"
          value={escala.bateria}
          onChange={(e) => setEscala({ ...escala, bateria: e.target.value })}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white w-full p-2 rounded"
        >
          Salvar Alterações
        </button>

        {mensagem && <p className="mt-4 text-center">{mensagem}</p>}
      </form>
    </div>
  );
}

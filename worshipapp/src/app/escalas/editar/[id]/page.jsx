// src/app/escalas/editar/[id]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import usePermission from "@/hooks/usePermission";
import { useToast } from "@/components/ToastNotification"; // Importa o useToast

export default function EditarEscalaPage({ params }) {
  // Apenas 'lider' pode editar escalas
  usePermission(['lider']); 

  const { id } = params;
  const router = useRouter();
  const [data, setData] = useState("");
  const [vocal, setVocal] = useState("");
  const [guitarra, setGuitarra] = useState("");
  const [teclado, setTeclado] = useState("");
  const [bateria, setBateria] = useState("");
  const [loading, setLoading] = useState(true);
  // const [mensagem, setMensagem] = useState(""); // Removido
  const { addToast } = useToast(); // Obtém a função addToast

  useEffect(() => {
    async function fetchEscala() {
      if (!id) return;
      setLoading(true);
      // setMensagem(""); // Removido
      try {
        const docRef = doc(db, "escalas", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const escalaData = docSnap.data();
          setData(escalaData.data || "");
          setVocal(escalaData.vocal ? escalaData.vocal.join(", ") : "");
          setGuitarra(escalaData.guitarra ? escalaData.guitarra.join(", ") : "");
          setTeclado(escalaData.teclado ? escalaData.teclado.join(", ") : "");
          setBateria(escalaData.bateria ? escalaData.bateria.join(", ") : "");
        } else {
          addToast("Escala não encontrada.", "error"); // Usa addToast
          // Opcional: redirecionar se a escala não for encontrada
          // router.push("/escalas/lista");
        }
      } catch (error) {
        addToast("Erro ao carregar escala: " + error.message, "error"); // Usa addToast
        console.error("Erro ao carregar escala para edição:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEscala();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setMensagem(""); // Removido

    if (!data || !vocal) {
      addToast("Por favor, preencha a data e o vocal.", "error");
      return;
    }

    try {
      const docRef = doc(db, "escalas", id);
      await updateDoc(docRef, {
        data,
        vocal: vocal.split(",").map((nome) => nome.trim()),
        guitarra: guitarra.split(",").map((nome) => nome.trim()),
        teclado: teclado.split(",").map((nome) => nome.trim()),
        bateria: bateria.split(",").map((nome) => nome.trim()),
      });
      addToast("Escala atualizada com sucesso!", "success");
    } catch (error) {
      addToast("Erro ao atualizar escala: " + error.message, "error");
      console.error("Erro ao atualizar escala:", error);
    }
  };

  if (loading) {
    return <p className="p-4 text-center">Carregando escala para edição...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Editar Escala</h2>

        {/* <p> de mensagem removido */}

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
          Atualizar Escala
        </button>
      </form>
    </div>
  );
}

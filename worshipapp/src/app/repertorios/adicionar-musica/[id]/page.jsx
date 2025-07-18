// src/app/repertorios/adicionar-musica/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";
import usePermission from "@/hooks/usePermission"; // Importa o hook de permissão
import { useToast } from "@/components/ToastNotification"; // Importa o useToast

export default function AdicionarMusicaAoRepertorio() {
  // Apenas 'lider' e 'ministro' podem acessar
  usePermission(['lider', 'ministro']);

  const { id } = useParams(); // Pega o ID do repertório da URL
  const router = useRouter();
  const { addToast } = useToast(); // Obtém a função addToast

  const [repertorio, setRepertorio] = useState(null);
  const [nome, setNome] = useState("");
  const [youtube, setYoutube] = useState("");
  const [cifra, setCifra] = useState("");
  const [tomOriginal, setTomOriginal] = useState("");
  const [tomAdaptado, setTomAdaptado] = useState("");
  // const [mensagem, setMensagem] = useState(""); // Removido
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarRepertorio() {
      if (!id) return;
      setLoading(true);
      // setMensagem(""); // Removido
      try {
        const docRef = doc(db, "repertorios", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setRepertorio({ id: docSnap.id, ...docSnap.data() });
        } else {
          addToast("Repertório não encontrado.", "error");
        }
      } catch (error) {
        addToast("Erro ao carregar repertório: " + error.message, "error");
        console.error("Erro ao carregar repertório:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarRepertorio();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    // setMensagem(""); // Removido

    if (!nome) {
      addToast("Por favor, preencha o nome da música.", "error");
      return;
    }

    try {
      const novaMusica = {
        nome,
        youtube,
        cifra,
        tomOriginal,
        tomAdaptado,
      };

      const docRef = doc(db, "repertorios", id);
      await updateDoc(docRef, {
        musicas: arrayUnion(novaMusica),
      });

      addToast("Música adicionada com sucesso ao repertório!", "success");
      setNome("");
      setYoutube("");
      setCifra("");
      setTomOriginal("");
      setTomAdaptado("");

      setTimeout(() => router.push("/repertorios/lista"), 1500);
    } catch (error) {
      addToast("Erro ao adicionar música: " + error.message, "error");
      console.error("Erro ao adicionar música:", error);
    }
  }

  if (loading) {
    return <p className="p-4 text-center">Carregando repertório...</p>;
  }

  if (!repertorio) {
    return <p className="p-4 text-center text-red-600">Repertório não encontrado ou erro ao carregar.</p>; // Mensagem mais genérica
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Adicionar Música ao Repertório
        </h1>
        <p className="text-center mb-4">
          **Culto: {new Date(repertorio.dataCulto).toLocaleDateString()}**
        </p>

        <label className="block mb-2 font-semibold">Nome da Música:</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          required
        />

        <label className="block mb-2 font-semibold">Link YouTube:</label>
        <input
          type="url"
          value={youtube}
          onChange={(e) => setYoutube(e.target.value)}
          placeholder="Ex: https://youtube.com/watch?v=..."
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />

        <label className="block mb-2 font-semibold">Link CifraClub:</label>
        <input
          type="url"
          value={cifra}
          onChange={(e) => setCifra(e.target.value)}
          placeholder="Ex: https://cifraclub.com.br/artista/musica"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />

        <label className="block mb-2 font-semibold">Tom Original:</label>
        <input
          type="text"
          value={tomOriginal}
          onChange={(e) => setTomOriginal(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />

        <label className="block mb-2 font-semibold">Tom Adaptado:</label>
        <input
          type="text"
          value={tomAdaptado}
          onChange={(e) => setTomAdaptado(e.target.value)}
          className="w-full p-2 mb-6 border border-gray-300 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded"
        >
          Adicionar Música
        </button>

        {/* <p> de mensagem removido */}
      </form>
    </div>
  );
}

// src/app/repertorios/editar-musica/[repertorioId]/[musicaIndex]/page.jsx
"use client";

import { useState, useEffect } from "react"; // <--- CORREÇÃO AQUI
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import usePermission from "@/hooks/usePermission";
import { useToast } from "@/components/ToastNotification";

export default function EditarMusicaDoRepertorio() {
  usePermission(['lider', 'ministro']);

  const { repertorioId, musicaIndex } = useParams();
  const router = useRouter();
  const { addToast } = useToast();

  const [repertorio, setRepertorio] = useState(null);
  const [nome, setNome] = useState("");
  const [youtube, setYoutube] = useState("");
  const [cifra, setCifra] = useState("");
  const [tomOriginal, setTomOriginal] = useState("");
  const [tomAdaptado, setTomAdaptado] = useState("");
  const [loading, setLoading] = useState(true);

  // Função auxiliar para garantir array a partir de string ou array
  function toArray(strOrArray) {
    if (Array.isArray(strOrArray)) return strOrArray;
    if (typeof strOrArray === "string")
      return strOrArray.split(",").map((nome) => nome.trim());
    return [];
  }

  useEffect(() => {
    async function carregarMusica() {
      if (!repertorioId || musicaIndex === undefined) return;
      setLoading(true);
      try {
        const docRef = doc(db, "repertorios", repertorioId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const dadosRepertorio = { id: docSnap.id, ...docSnap.data() };
          setRepertorio(dadosRepertorio);

          const index = parseInt(musicaIndex, 10);

          if (dadosRepertorio.musicas && dadosRepertorio.musicas[index]) {
            const musicaParaEditar = dadosRepertorio.musicas[index];
            setNome(musicaParaEditar.nome || "");
            setYoutube(musicaParaEditar.youtube || "");
            setCifra(musicaParaEditar.cifra || "");
            setTomOriginal(musicaParaEditar.tomOriginal || "");
            setTomAdaptado(musicaParaEditar.tomAdaptado || "");
          } else {
            addToast("Música não encontrada no repertório.", "error");
          }
        } else {
          addToast("Repertório não encontrado.", "error");
        }
      } catch (error) {
        addToast("Erro ao carregar música: " + error.message, "error");
        console.error("Erro ao carregar música para edição:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarMusica();
  }, [repertorioId, musicaIndex]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!nome) {
      addToast("Por favor, preencha o nome da música.", "error");
      return;
    }

    try {
      const docRef = doc(db, "repertorios", repertorioId);
      const index = parseInt(musicaIndex, 10);

      const musicasAtualizadas = [...repertorio.musicas];
      musicasAtualizadas[index] = {
        nome,
        youtube,
        cifra,
        tomOriginal,
        tomAdaptado,
      };

      await updateDoc(docRef, {
        musicas: musicasAtualizadas,
      });

      addToast("Música atualizada com sucesso!", "success");
      setTimeout(() => router.push("/repertorios/lista"), 1500);
    } catch (error) {
      addToast("Erro ao atualizar música: " + error.message, "error");
      console.error("Erro ao atualizar música:", error);
    }
  }

  if (loading) {
    return <p className="p-4 text-center">Carregando música...</p>;
  }

  if (!repertorio || musicaIndex === undefined || !repertorio.musicas || !repertorio.musicas[parseInt(musicaIndex, 10)]) {
    return <p className="p-4 text-center text-red-600">Música ou repertório não encontrado.</p>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Editar Música do Repertório
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
          Atualizar Música
        </button>
      </form>
    </div>
  );
}

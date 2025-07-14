"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function EditarMusicaPage({ params }) {
  const { repertorioId, musicaIndex } = params;
  const router = useRouter();

  const [musica, setMusica] = useState({
    nome: "",
    youtube: "",
    cifra: "",
    tomOriginal: "",
    tomAdaptado: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarMusica() {
      const ref = doc(db, "repertorios", repertorioId);
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
        const repertorioData = docSnap.data();
        const index = parseInt(musicaIndex, 10);

        if (repertorioData.musicas && repertorioData.musicas[index]) {
          setMusica(repertorioData.musicas[index]);
        } else {
          alert("Música não encontrada.");
          router.push("/repertorios/lista");
        }
      } else {
        alert("Repertório não encontrado.");
        router.push("/repertorios/lista");
      }
      setLoading(false);
    }

    carregarMusica();
  }, [repertorioId, musicaIndex, router]);

  function handleChange(e) {
    const { name, value } = e.target;
    setMusica((prev) => ({ ...prev, [name]: value }));
  }

  async function salvarMusica(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const ref = doc(db, "repertorios", repertorioId);
      const docSnap = await getDoc(ref);

      if (!docSnap.exists()) {
        alert("Repertório não encontrado.");
        router.push("/repertorios/lista");
        return;
      }

      const repertorioData = docSnap.data();
      const musicas = repertorioData.musicas || [];
      const index = parseInt(musicaIndex, 10);

      // Atualiza a música no array
      musicas[index] = musica;

      // Atualiza no Firestore
      await updateDoc(ref, { musicas });

      alert("Música atualizada com sucesso!");
      router.push("/repertorios/lista");
    } catch (error) {
      alert("Erro ao salvar: " + error.message);
      setLoading(false);
    }
  }

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="min-h-screen p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Editar Música</h1>

      <form onSubmit={salvarMusica} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Nome da Música</label>
          <input
            type="text"
            name="nome"
            value={musica.nome}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Link YouTube</label>
          <input
            type="url"
            name="youtube"
            value={musica.youtube}
            onChange={handleChange}
            placeholder="https://youtube.com/..."
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Link CifraClub</label>
          <input
            type="url"
            name="cifra"
            value={musica.cifra}
            onChange={handleChange}
            placeholder="https://cifraclub.com.br/..."
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Tom Original</label>
          <input
            type="text"
            name="tomOriginal"
            value={musica.tomOriginal}
            onChange={handleChange}
            placeholder="Ex: C, D#m, F#"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Tom Adaptado</label>
          <input
            type="text"
            name="tomAdaptado"
            value={musica.tomAdaptado}
            onChange={handleChange}
            placeholder="Ex: B, Dm, G#"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          Salvar
        </button>
      </form>
    </div>
  );
}

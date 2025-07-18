"use client";

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import usePermission from "@/hooks/usePermission";

export default function CadastroRepertorio() {
    usePermission(['lider', 'ministro']);
  const router = useRouter();

  const [dataCulto, setDataCulto] = useState("");
  const [musicas, setMusicas] = useState([
    { nome: "", youtube: "", cifra: "", tomOriginal: "", tomAdaptado: "" },
  ]);
  const [mensagem, setMensagem] = useState("");

  function handleMusicaChange(index, campo, valor) {
    const novasMusicas = [...musicas];
    novasMusicas[index][campo] = valor;
    setMusicas(novasMusicas);
  }

  function adicionarMusica() {
    setMusicas([...musicas, { nome: "", youtube: "", cifra: "", tomOriginal: "", tomAdaptado: "" }]);
  }

  function removerMusica(index) {
    const novasMusicas = [...musicas];
    novasMusicas.splice(index, 1);
    setMusicas(novasMusicas);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMensagem("");

    if (!dataCulto) {
      setMensagem("Por favor, informe a data do culto.");
      return;
    }

    if (musicas.length === 0) {
      setMensagem("Adicione pelo menos uma música.");
      return;
    }

    try {
      await addDoc(collection(db, "repertorios"), {
        dataCulto,
        musicas,
        criadoEm: new Date().toISOString(),
      });

      setMensagem("✅ Repertório cadastrado com sucesso!");
      setDataCulto("");
      setMusicas([{ nome: "", youtube: "", cifra: "", tomOriginal: "", tomAdaptado: "" }]);
      
      setTimeout(() => router.push("/repertorios/lista"), 1500);
    } catch (error) {
      setMensagem("❌ Erro ao salvar repertório: " + error.message);
    }
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Cadastrar Repertório</h1>

        <label className="block mb-2 font-semibold">Data do Culto</label>
        <input
          type="date"
          value={dataCulto}
          onChange={(e) => setDataCulto(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          required
        />

        <h2 className="text-xl font-semibold mb-4">Músicas</h2>

        {musicas.map((musica, index) => (
          <div key={index} className="mb-6 border-b pb-4">
            <label className="block mb-1 font-semibold">Nome da Música</label>
            <input
              type="text"
              value={musica.nome}
              onChange={(e) => handleMusicaChange(index, "nome", e.target.value)}
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              required
            />

            <label className="block mb-1 font-semibold">Link YouTube</label>
            <input
              type="url"
              value={musica.youtube}
              onChange={(e) => handleMusicaChange(index, "youtube", e.target.value)}
              placeholder="https://youtube.com/..."
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />

            <label className="block mb-1 font-semibold">Link CifraClub</label>
            <input
              type="url"
              value={musica.cifra}
              onChange={(e) => handleMusicaChange(index, "cifra", e.target.value)}
              placeholder="https://www.cifraclub.com.br/..."
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />

            <label className="block mb-1 font-semibold">Tom Original</label>
            <input
              type="text"
              value={musica.tomOriginal}
              onChange={(e) => handleMusicaChange(index, "tomOriginal", e.target.value)}
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />

            <label className="block mb-1 font-semibold">Tom Adaptado</label>
            <input
              type="text"
              value={musica.tomAdaptado}
              onChange={(e) => handleMusicaChange(index, "tomAdaptado", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />

            {musicas.length > 1 && (
              <button
                type="button"
                onClick={() => removerMusica(index)}
                className="mt-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                Remover música
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={adicionarMusica}
          className="mb-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          + Adicionar música
        </button>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded"
        >
          Salvar Repertório
        </button>

        {mensagem && <p className="mt-4 text-center">{mensagem}</p>}
      </form>
    </div>
  );
}

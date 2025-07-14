"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, doc, deleteDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function ListaRepertorios() {
  const [repertorios, setRepertorios] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    carregarRepertorios();
  }, []);

  async function carregarRepertorios() {
    setLoading(true);
    const ref = collection(db, "repertorios");
    const q = query(ref, orderBy("dataCulto", "asc"));
    const snapshot = await getDocs(q);

    const dados = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setRepertorios(dados);
    setLoading(false);
  }

  // Excluir música específica do repertório
  async function excluirMusica(repertorioId, musica) {
    const confirm = window.confirm(`Quer mesmo excluir a música "${musica.nome}"?`);
    if (!confirm) return;

    try {
      const ref = doc(db, "repertorios", repertorioId);

      // Usando arrayRemove para remover o objeto da música do array 'musicas'
      await updateDoc(ref, {
        musicas: arrayRemove(musica),
      });

      alert("Música excluída com sucesso!");
      carregarRepertorios();
    } catch (error) {
      alert("Erro ao excluir música: " + error.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-6 max-w-4xl mx-auto flex justify-between items-center">
        🎵 Repertórios Cadastrados
        <button
          onClick={() => router.push("/repertorios/cadastro")}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          + Novo Repertório
        </button>
      </h1>

      <div className="max-w-4xl mx-auto space-y-6">
        {loading && <p>Carregando repertórios...</p>}

        {!loading && repertorios.length === 0 && (
          <p className="text-center text-gray-600">Nenhum repertório cadastrado ainda.</p>
        )}

        {!loading &&
          repertorios.map((rep) => (
            <div key={rep.id} className="bg-white rounded shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Culto: {new Date(rep.dataCulto).toLocaleDateString()}
                </h2>
                <button
                  onClick={() => router.push(`/repertorios/adicionar-musica/${rep.id}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                >
                  + Adicionar Música
                </button>
              </div>

              {rep.musicas.length === 0 && <p className="text-gray-600">Nenhuma música cadastrada.</p>}

              {rep.musicas.map((musica, i) => (
                <div key={i} className="mb-4 border-b pb-2 flex justify-between items-center">
                  <div>
                    <p><strong>Nome:</strong> {musica.nome}</p>
                    {musica.youtube && (
                      <p>
                        <strong>YouTube: </strong>
                        <a href={musica.youtube} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                          {musica.youtube}
                        </a>
                      </p>
                    )}
                    {musica.cifra && (
                      <p>
                        <strong>CifraClub: </strong>
                        <a href={musica.cifra} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                          {musica.cifra}
                        </a>
                      </p>
                    )}
                    <p><strong>Tom Original:</strong> {musica.tomOriginal || "-"}</p>
                    <p><strong>Tom Adaptado:</strong> {musica.tomAdaptado || "-"}</p>
                  </div>

                  <div className="space-x-2">
                    <button
                      onClick={() =>
                        router.push(`/repertorios/editar-musica/${rep.id}/${i}`)
                      }
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => excluirMusica(rep.id, musica)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}

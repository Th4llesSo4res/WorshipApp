// src/app/repertorios/lista/page.jsx
"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ToastNotification"; // Importa o useToast

export default function ListaRepertorios() {
  const [repertorios, setRepertorios] = useState([]);
  const [loading, setLoading] = useState(true); // Alterado para true para refletir carregamento inicial
  // const [mensagem, setMensagem] = useState(""); // Removido
  const router = useRouter();
  const { role, loading: authLoading } = useAuth();
  const { addToast } = useToast(); // Obtém a função addToast

  async function carregarRepertorios() {
    setLoading(true);
    // setMensagem(""); // Removido
    try {
      const ref = collection(db, "repertorios");
      const q = query(ref, orderBy("dataCulto", "asc"));
      const snapshot = await getDocs(q);

      const dados = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRepertorios(dados);
    } catch (error) {
      console.error("Erro ao carregar repertórios:", error);
      addToast("Erro ao carregar repertórios. Por favor, tente novamente.", "error");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!authLoading) {
      carregarRepertorios();
    }
  }, [authLoading]);

  async function excluirMusica(repertorioId, musica) {
    const confirm = window.confirm(`Quer mesmo excluir a música "${musica.nome}"?`);
    if (!confirm) return;

    // setMensagem(""); // Removido
    try {
      const ref = doc(db, "repertorios", repertorioId);
      await updateDoc(ref, {
        musicas: arrayRemove(musica),
      });

      addToast("Música excluída com sucesso!", "success");
      carregarRepertorios();
    } catch (error) {
      addToast("Erro ao excluir música: " + error.message, "error");
      console.error("Erro ao excluir música:", error);
    }
  }

  async function excluirRepertorio(id) {
    const confirm = window.confirm("⚠️ Tem certeza que deseja excluir o repertório completo?");
    if (!confirm) return;

    // setMensagem(""); // Removido
    try {
      await deleteDoc(doc(db, "repertorios", id));
      addToast("Repertório excluído com sucesso!", "success");
      carregarRepertorios();
    } catch (error) {
      addToast("Erro ao excluir repertório: " + error.message, "error");
      console.error("Erro ao excluir repertório:", error);
    }
  }

  // Permissão para gerenciar repertórios (Líder e Ministro)
  const canManageRepertorios = role === 'lider' || role === 'ministro';

  if (loading || authLoading) {
    return <p className="p-4 text-center">Carregando repertórios...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-6 max-w-4xl mx-auto flex justify-between items-center">
        🎵 Repertórios Cadastrados
        {canManageRepertorios && (
          <button
            onClick={() => router.push("/repertorios/cadastro")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            + Novo Repertório
          </button>
        )}
      </h1>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* <p> de mensagem removido */}

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
                {canManageRepertorios && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/repertorios/adicionar-musica/${rep.id}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      + Adicionar Música
                    </button>

                    <button
                      onClick={() => excluirRepertorio(rep.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      🗑 Excluir Repertório
                    </button>
                  </div>
                )}
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

                  {canManageRepertorios && (
                    <div className="space-x-2">
                      <button
                        onClick={() => router.push(`/repertorios/editar-musica/${rep.id}/${i}`)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => excluirMusica(rep.id, musica)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Excluir
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}

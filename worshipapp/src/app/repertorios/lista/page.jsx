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
import { useAuth } from "@/context/AuthContext"; // <--- 1. NOVO: Importa o useAuth

export default function ListaRepertorios() {
  const [repertorios, setRepertorios] = useState([]);
  const [loading, setLoading] = useState(true); // Alterado para true para refletir carregamento inicial
  const [mensagem, setMensagem] = useState(""); // Adicionado estado de mensagem para feedback
  const router = useRouter();
  const { role, loading: authLoading } = useAuth(); // <--- 2. NOVO: Pega o role e authLoading do AuthContext

  async function carregarRepertorios() {
    setLoading(true);
    setMensagem(""); // Limpa mensagens anteriores
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
      setMensagem("Erro ao carregar repertórios. Por favor, tente novamente.");
    }
    setLoading(false);
  }

  useEffect(() => {
    // <--- 3. NOVO: Garante que o papel do usuário já foi carregado antes de carregar os repertórios
    if (!authLoading) {
      carregarRepertorios();
    }
  }, [authLoading]); // Depende do estado de carregamento da autenticação

  async function excluirMusica(repertorioId, musica) {
    const confirm = window.confirm(`Quer mesmo excluir a música "${musica.nome}"?`);
    if (!confirm) return;

    setMensagem(""); // Limpa mensagens anteriores
    try {
      const ref = doc(db, "repertorios", repertorioId);
      await updateDoc(ref, {
        musicas: arrayRemove(musica),
      });

      setMensagem("✅ Música excluída com sucesso!");
      carregarRepertorios();
    } catch (error) {
      setMensagem("❌ Erro ao excluir música: " + error.message);
      console.error("Erro ao excluir música:", error);
    }
  }

  async function excluirRepertorio(id) {
    const confirm = window.confirm("⚠️ Tem certeza que deseja excluir o repertório completo?");
    if (!confirm) return;

    setMensagem(""); // Limpa mensagens anteriores
    try {
      await deleteDoc(doc(db, "repertorios", id));
      setMensagem("✅ Repertório excluído com sucesso!");
      carregarRepertorios();
    } catch (error) {
      setMensagem("❌ Erro ao excluir repertório: " + error.message);
      console.error("Erro ao excluir repertório:", error);
    }
  }

  // <--- 4. NOVO: Variável para determinar se o usuário pode gerenciar repertórios
  const canManageRepertorios = role === 'lider' || role === 'ministro';

  // <--- 5. NOVO: Carregamento combinado (do AuthContext e da lista)
  if (loading || authLoading) {
    return <p className="p-4 text-center">Carregando repertórios...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-6 max-w-4xl mx-auto flex justify-between items-center">
        🎵 Repertórios Cadastrados
        {/* <--- 5. NOVO: Mostra o botão "Novo Repertório" apenas se canManageRepertorios for true */}
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
        {mensagem && <p className="text-center mt-4" style={{ color: mensagem.startsWith('✅') ? 'green' : 'red' }}>{mensagem}</p>}

        {!loading && repertorios.length === 0 && (
          <p className="text-center text-gray-600">Nenhum repertório cadastrado ainda.</p>
        )}

        {!loading &&
          repertorios.map((rep) => (
            <div key={rep.id} className="bg-white rounded shadow p-6">
              {/* === CONSOLE.LOG ADICIONADO AQUI === */}
              {/* {console.log("ID do Repertório (rep.id):", rep.id)} REMOVIDO AGORA PARA PRODUÇÃO */}
              {/* ================================== */}

              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Culto: {new Date(rep.dataCulto).toLocaleDateString()}
                </h2>
                {/* <--- 5. NOVO: Mostra os botões "+ Adicionar Música" e "Excluir Repertório" apenas se canManageRepertorios for true */}
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

                  {/* <--- 5. NOVO: Mostra os botões "Editar" e "Excluir" da música apenas se canManageRepertorios for true */}
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
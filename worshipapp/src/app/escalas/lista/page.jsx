"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function ListaEscalas() {
  const [escalas, setEscalas] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function carregarEscalas() {
    setLoading(true);
    const ref = collection(db, "escalas");
    const q = query(ref, orderBy("data", "asc"));
    const snapshot = await getDocs(q);

    const dados = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setEscalas(dados);
    setLoading(false);
  }

  useEffect(() => {
    carregarEscalas();
  }, []);

  async function excluirEscala(id) {
    const confirmar = window.confirm("Tem certeza que deseja excluir esta escala?");
    if (!confirmar) return;

    try {
      await deleteDoc(doc(db, "escalas", id));
      alert("✅ Escala excluída com sucesso!");
      carregarEscalas();
    } catch (error) {
      alert("❌ Erro ao excluir: " + error.message);
    }
  }

  if (loading) return <p className="p-4 text-center">Carregando escalas...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">📅 Escalas Cadastradas</h1>

      <div className="max-w-4xl mx-auto space-y-6">
        {escalas.map((escala) => (
          <div
            key={escala.id}
            className="bg-white rounded shadow p-6 flex flex-col md:flex-row md:justify-between items-start md:items-center"
          >
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Culto: {new Date(escala.data).toLocaleDateString()}
              </h2>
              <p><strong>Vocal:</strong> {escala.vocal.join(", ")}</p>
              <p><strong>Guitarra:</strong> {escala.guitarra.join(", ")}</p>
              <p><strong>Teclado:</strong> {escala.teclado.join(", ")}</p>
              <p><strong>Bateria:</strong> {escala.bateria.join(", ")}</p>
            </div>

            <div className="flex gap-2 mt-4 md:mt-0">
              <button
                onClick={() => router.push(`/escalas/editar/${escala.id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2"
              >
                Editar
              </button>

              <button
                onClick={() => excluirEscala(escala.id)}
                className="bg-red-600 hover:bg-red-700 text-white rounded px-4 py-2"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}

        {escalas.length === 0 && (
          <p className="text-center text-gray-600">Nenhuma escala cadastrada ainda.</p>
        )}
      </div>
    </div>
  );
}

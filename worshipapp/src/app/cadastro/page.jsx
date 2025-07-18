// src/app/cadastro/page.jsx
"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import usePermission from "@/hooks/usePermission";
import { useToast } from "@/components/ToastNotification"; // Importa o useToast

export default function CadastroPage() {
  // Apenas 'lider' pode acessar esta página de cadastro de usuários
  usePermission(['lider']); 

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState("musico"); 
  // const [erro, setErro] = useState(""); // Removido, useToast fará isso
  // const [sucesso, setSucesso] = useState(""); // Removido, useToast fará isso
  const { addToast } = useToast(); // Obtém a função addToast

  const handleCadastro = async (e) => {
    e.preventDefault();
    // setErro(""); // Removido
    // setSucesso(""); // Removido

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      await setDoc(doc(db, "userRoles", user.uid), {
        email: user.email,
        role: role,
        createdAt: new Date().toISOString()
      });

      addToast(`Usuário "${email}" com papel "${role}" criado com sucesso!`, "success"); // Usa addToast
      setEmail("");
      setSenha("");
      setRole("musico");
    } catch (err) {
      addToast("Erro ao criar usuário: " + err.message, "error"); // Usa addToast
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleCadastro}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Cadastro de Usuário</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="password"
          placeholder="Senha (mín. 6 caracteres)"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          required
        />

        <label htmlFor="role" className="block mb-2 font-semibold">
          Papel do Usuário:
        </label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full mb-6 p-2 border border-gray-300 rounded"
          required
        >
          <option value="lider">Líder</option>
          <option value="ministro">Ministro</option>
          <option value="musico">Músico</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
        >
          Cadastrar
        </button>

        {/* <p> de sucesso/erro removidos, pois useToast fará isso */}
      </form>
    </div>
  );
}

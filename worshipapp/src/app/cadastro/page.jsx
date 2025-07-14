// src/app/cadastro/page.jsx
"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import usePermission from "@/hooks/usePermission"; // Importa o novo hook de permissão

export default function CadastroPage() {
  // Apenas 'lider' pode acessar esta página de cadastro de usuários
  // Se o usuário não for líder, será redirecionado para /dashboard (padrão)
  usePermission(['lider', 'ministro']); 

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState("musico"); 
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      await setDoc(doc(db, "userRoles", user.uid), {
        email: user.email,
        role: role,
        createdAt: new Date().toISOString()
      });

      setSucesso(`Usuário "${email}" com papel "${role}" criado com sucesso!`);
      setEmail("");
      setSenha("");
      setRole("musico");
    } catch (err) {
      setErro("Erro ao criar usuário: " + err.message);
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

        {sucesso && <p className="text-green-600 mt-4">{sucesso}</p>}
        {erro && <p className="text-red-600 mt-4">{erro}</p>}
      </form>
    </div>
  );
}
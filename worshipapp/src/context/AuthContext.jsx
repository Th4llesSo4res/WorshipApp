// src/context/AuthContext.jsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase"; // Importa 'auth' e 'db'

// 1. Cria o Contexto
const AuthContext = createContext();

// 2. Cria um Hook personalizado para usar o Contexto
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. Cria o Provedor do Contexto
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null); // Novo estado para o papel do usuário
  const [loading, setLoading] = useState(true); // Estado para indicar se o carregamento inicial terminou

  useEffect(() => {
    // Monitora o estado de autenticação do Firebase
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user); // Atualiza o usuário logado

      if (user) {
        // Se o usuário está logado, busca o papel dele no Firestore
        try {
          const docRef = doc(db, "userRoles", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setRole(docSnap.data().role); // Salva o papel (role)
          } else {
            console.warn("Nenhum papel encontrado para o usuário:", user.uid);
            setRole(null); // Define como nulo se não encontrar
          }
        } catch (error) {
          console.error("Erro ao buscar papel do usuário:", error);
          setRole(null);
        }
      } else {
        setRole(null); // Se o usuário não está logado, o papel é nulo
      }
      setLoading(false); // Carregamento inicial terminou
    });

    // Função de limpeza: desinscreve o listener quando o componente é desmontado
    return unsubscribe;
  }, []); // Executa apenas uma vez na montagem do componente

  // Valores que serão fornecidos para todos os componentes filhos
  const value = {
    currentUser,
    role, // Agora o papel também é fornecido
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Somente renderiza os filhos após o carregamento inicial */}
      {!loading && children}
    </AuthContext.Provider>
  );
};
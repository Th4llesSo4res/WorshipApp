// src/components/ToastNotification.jsx
"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { createPortal } from "react-dom"; // Para renderizar fora da árvore de componentes

// 1. Cria o Contexto para as notificações
const ToastContext = createContext();

// 2. Hook personalizado para usar o contexto de notificação
export const useToast = () => {
  return useContext(ToastContext);
};

// 3. Componente Toast principal
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]); // Armazena as notificações ativas
  const [isBrowser, setIsBrowser] = useState(false); // Para garantir que o portal só renderize no navegador

  useEffect(() => {
    setIsBrowser(true); // Indica que estamos no ambiente do navegador
  }, []);

  // Função para adicionar uma notificação
  const addToast = (message, type = "success") => {
    const id = Math.random().toString(36).substr(2, 9); // ID único para cada toast
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

    // Remove o toast automaticamente após 3 segundos
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  // Função para remover uma notificação
  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  // Renderiza as notificações em um portal (fora do fluxo normal do DOM)
  const toastContainer = isBrowser
    ? createPortal(
        <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} {...toast} onRemove={() => removeToast(toast.id)} />
          ))}
        </div>,
        document.body // Anexa as notificações diretamente ao body do HTML
      )
    : null;

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {toastContainer} {/* Renderiza o container de notificações */}
    </ToastContext.Provider>
  );
};

// Componente individual de cada notificação Toast
const ToastItem = ({ message, type, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animação de entrada
    setIsVisible(true);
    // Animação de saída (antes de ser removido pelo addToast)
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2700); // Um pouco antes do removeToast para a animação

    return () => clearTimeout(timer);
  }, []);

  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-gray-500"; // Padrão

  const icon =
    type === "success"
      ? "✅"
      : type === "error"
      ? "❌"
      : "ℹ️"; // Ícone para informativo

  return (
    <div
      className={`p-3 rounded-lg shadow-md flex items-center text-white transition-all duration-300 transform
        ${bgColor} ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
      role="alert"
    >
      <span className="mr-2 text-xl">{icon}</span>
      <span>{message}</span>
      <button onClick={onRemove} className="ml-4 text-white hover:text-gray-200 focus:outline-none">
        &times;
      </button>
    </div>
  );
};
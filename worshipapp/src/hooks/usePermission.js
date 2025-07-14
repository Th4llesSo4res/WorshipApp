// src/hooks/usePermission.js
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const usePermission = (allowedRoles = [], redirectTo = '/dashboard') => {
  const { currentUser, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Se ainda está carregando, não faz nada
    if (loading) return;

    // Se não há usuário logado, redireciona para o login
    if (!currentUser) {
      router.push('/login');
      return;
    }

    // Se o papel do usuário não está na lista de papéis permitidos
    // ou se o papel ainda não foi carregado
    if (!role || (allowedRoles.length > 0 && !allowedRoles.includes(role))) {
      // console.log(`Acesso negado para o papel: ${role}. Redirecionando para: ${redirectTo}`);
      router.push(redirectTo); // Redireciona para a página de acesso negado ou dashboard
    }
  }, [currentUser, role, loading, allowedRoles, redirectTo, router]);

  // Retorna o papel para uso no componente, se necessário
  return { currentUser, role, loading };
};

export default usePermission;
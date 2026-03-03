import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [inicializando, setInicializando] = useState(true);

  // Tenta recuperar o usuário do token salvo ao carregar a página
  useEffect(() => {
    const tokenSalvo = localStorage.getItem('token');
    if (tokenSalvo) {
      api.get('/auth/me')
        .then((res) => setUsuario(res.data.usuario))
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
        })
        .finally(() => setInicializando(false));
    } else {
      setInicializando(false);
    }
  }, []);

  const login = useCallback(async (email, senha) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, senha });
      setToken(data.token);
      setUsuario(data.usuario);
      localStorage.setItem('token', data.token);
      return { sucesso: true };
    } catch (err) {
      return {
        sucesso: false,
        erro: err.response?.data?.error || 'Erro ao fazer login. Tente novamente.',
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem('token');
  }, []);

  const value = {
    usuario,
    token,
    loading,
    inicializando,
    login,
    logout,
    isAdmin: usuario?.perfil === 'admin',
    isProfissional: usuario?.perfil === 'profissional',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    const resultado = await login(email, senha);
    if (resultado.sucesso) {
      navigate('/dashboard');
    } else {
      setErro(resultado.erro);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">

        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl backdrop-blur-sm mb-4">
            <span className="text-4xl" role="img" aria-label="Hospital">🏥</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Renascer em Cristo</h1>
          <p className="text-blue-200 text-sm">Sistema de Gerenciamento de Acolhidos</p>
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">Acesso ao Sistema</h2>

          {erro && (
            <div className="alert alert-error mb-5">
              <span>⚠️</span>
              <span>{erro}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="label">Email</label>
              <input
                id="email"
                type="email"
                className="input"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="senha" className="label">Senha</label>
              <div className="relative">
                <input
                  id="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  className="input pr-12"
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 text-sm font-medium"
                  onClick={() => setMostrarSenha((v) => !v)}
                  tabIndex={-1}
                >
                  {mostrarSenha ? 'Ocultar' : 'Ver'}
                </button>
              </div>
            </div>

            {/* Botão */}
            <button
              type="submit"
              className="btn btn-primary w-full mt-2"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Entrando...
                </span>
              ) : (
                'Entrar no Sistema'
              )}
            </button>
          </form>

          <div className="text-center mt-5">
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Esqueceu a senha?
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-blue-300 text-xs mt-6">
          Projeto Extensionista — ADS © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

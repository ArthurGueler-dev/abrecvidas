import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail]               = useState('');
  const [senha, setSenha]               = useState('');
  const [erro, setErro]                 = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const { login, loading }              = useAuth();
  const navigate                        = useNavigate();

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
    <div className="min-h-screen flex bg-white">

      {/* Painel esquerdo — identidade */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between bg-[#1E3A8A] px-12 py-10">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="ABREC" className="h-12 w-12 object-contain rounded-full bg-white/10 p-1" />
          <div>
            <p className="text-white font-bold text-lg leading-tight">ABREC</p>
            <p className="text-blue-300 text-xs">Renascer em Cristo</p>
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <ShieldCheck size={14} />
            SIGA — Sistema Integrado de Gestão de Acolhimento
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Cuidando de vidas com organização e responsabilidade.
          </h1>
          <p className="text-blue-300 text-base leading-relaxed">
            Plataforma segura para gestão completa dos acolhidos da Associação Beneficente Renascer em Cristo.
          </p>
        </div>

        <div className="flex items-center gap-4 text-blue-400 text-xs">
          <span>© {new Date().getFullYear()} ABREC</span>
          <span>·</span>
          <span>Versão 2.0 — Sprint 2</span>
          <span>·</span>
          <span>Dados protegidos por LGPD</span>
        </div>
      </div>

      {/* Painel direito — formulário */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-10 bg-slate-50">

        {/* Logo mobile */}
        <div className="lg:hidden flex flex-col items-center mb-8">
          <img src="/logo.png" alt="ABREC" className="h-20 w-20 object-contain mb-3" />
          <p className="font-bold text-gray-900 text-xl">ABREC</p>
          <p className="text-gray-500 text-sm">Associação Beneficente Renascer em Cristo</p>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Acesso ao sistema</h2>
            <p className="text-gray-500 text-sm mt-1">Entre com suas credenciais para continuar.</p>
          </div>

          {erro && (
            <div className="alert alert-error mb-5">
              <span className="mt-0.5 shrink-0">⚠️</span>
              <span>{erro}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="label">E-mail</label>
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

            <div>
              <label htmlFor="senha" className="label">Senha</label>
              <div className="relative">
                <input
                  id="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  className="input pr-11"
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setMostrarSenha((v) => !v)}
                  tabIndex={-1}
                >
                  {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-xs text-teal-600 hover:text-teal-800 font-medium">
                Esqueci a senha
              </button>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-full mt-2" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Entrando...
                </span>
              ) : (
                <>
                  <LogIn size={18} />
                  Entrar no sistema
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-8">
            Associação Beneficente Renascer em Cristo · {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const PERFIL_LABEL = {
  admin: 'Administrador',
  profissional: 'Profissional',
  visualizador: 'Visualizador',
};

export default function Header({ onToggleSidebar }) {
  const { usuario, logout } = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-white border-b border-neutral-200 shadow-sm flex items-center px-4 gap-4">
      {/* Botão hambúrguer (mobile) */}
      <button
        className="btn btn-ghost p-2 lg:hidden"
        onClick={onToggleSidebar}
        aria-label="Abrir menu"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2 flex-1">
        <span className="text-xl" role="img" aria-label="Hospital">🏥</span>
        <span className="font-bold text-neutral-900 text-lg hidden sm:block">Renascer em Cristo</span>
        <span className="font-bold text-neutral-900 text-lg sm:hidden">Renascer</span>
      </div>

      {/* User menu */}
      <div className="relative">
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
          onClick={() => setMenuAberto((v) => !v)}
        >
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {usuario?.nome?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-semibold text-neutral-900 leading-none">{usuario?.nome}</p>
            <p className="text-xs text-neutral-500 mt-0.5">{PERFIL_LABEL[usuario?.perfil] || usuario?.perfil}</p>
          </div>
          <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {menuAberto && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuAberto(false)} />
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 py-1 z-20">
              <div className="px-4 py-2 border-b border-neutral-100">
                <p className="text-sm font-semibold text-neutral-900">{usuario?.nome}</p>
                <p className="text-xs text-neutral-500">{usuario?.email}</p>
              </div>
              <button
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                onClick={logout}
              >
                Sair do Sistema
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

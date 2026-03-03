import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const itensMenu = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icone: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    perfis: ['admin', 'profissional', 'visualizador'],
  },
  {
    label: 'Acolhidos',
    href: '/acolhidos',
    icone: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    perfis: ['admin', 'profissional', 'visualizador'],
  },
  {
    label: 'Usuários',
    href: '/usuarios',
    icone: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    perfis: ['admin'],
  },
];

export default function Sidebar({ aberta, onFechar }) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const menuFiltrado = itensMenu.filter((item) =>
    item.perfis.includes(usuario?.perfil)
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Overlay mobile */}
      {aberta && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onFechar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-neutral-900 z-40 flex flex-col
          transition-transform duration-300
          ${aberta ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:top-16 lg:h-[calc(100vh-4rem)]
        `}
      >
        {/* Header mobile */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-neutral-700 lg:hidden">
          <span className="text-white font-bold">Menu</span>
          <button className="text-neutral-400 hover:text-white" onClick={onFechar}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Itens de navegação */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuFiltrado.map((item) => (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  onClick={onFechar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                    }`
                  }
                >
                  {item.icone}
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Rodapé - Logout */}
        <div className="px-3 py-4 border-t border-neutral-700">
          <button
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-red-400 transition-colors"
            onClick={handleLogout}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sair do Sistema
          </button>
        </div>
      </aside>
    </>
  );
}

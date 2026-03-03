import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserPlus, ClipboardList,
  FileText, Settings, LogOut, ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const itensMenu = [
  { label: 'Dashboard',      href: '/dashboard',   icone: LayoutDashboard, perfis: ['admin','profissional','visualizador'] },
  { label: 'Acolhidos',      href: '/acolhidos',   icone: Users,           perfis: ['admin','profissional','visualizador'] },
  { label: 'Novo Cadastro',  href: '/acolhidos/novo', icone: UserPlus,     perfis: ['admin','profissional'] },
  { label: 'Evoluções',      href: '/evolucoes',   icone: ClipboardList,   perfis: ['admin','profissional'] },
  { label: 'Relatórios',     href: '/relatorios',  icone: FileText,        perfis: ['admin','profissional','visualizador'] },
  { label: 'Usuários',       href: '/usuarios',    icone: ShieldCheck,     perfis: ['admin'] },
  { label: 'Configurações',  href: '/configuracoes', icone: Settings,      perfis: ['admin'] },
];

export default function Sidebar({ aberta, onFechar }) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const menu = itensMenu.filter((i) => i.perfis.includes(usuario?.perfil));

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <>
      {aberta && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onFechar} />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-60 z-40 flex flex-col
        bg-[#1E3A8A] transition-transform duration-300
        ${aberta ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:top-0
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-white/10 shrink-0">
          <img src="/logo.png" alt="ABREC" className="h-9 w-9 object-contain rounded-full bg-white/10 p-0.5" />
          <div>
            <p className="text-white font-bold text-sm leading-tight">ABREC</p>
            <p className="text-blue-300 text-[10px]">SIGA</p>
          </div>
          <button className="ml-auto text-blue-300 hover:text-white lg:hidden" onClick={onFechar}>✕</button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-0.5">
            {menu.map(({ label, href, icone: Icon }) => (
              <li key={href}>
                <NavLink
                  to={href}
                  onClick={onFechar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-teal-500 text-white'
                        : 'text-blue-200 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <Icon size={17} />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Usuário + logout */}
        <div className="px-3 py-4 border-t border-white/10 shrink-0">
          <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {usuario?.nome?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">{usuario?.nome}</p>
              <p className="text-blue-300 text-[10px] capitalize">{usuario?.perfil}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-blue-200 hover:bg-red-500/20 hover:text-red-300 transition-colors"
          >
            <LogOut size={17} />
            Sair do sistema
          </button>
        </div>
      </aside>
    </>
  );
}

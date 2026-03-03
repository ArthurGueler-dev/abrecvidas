import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PERFIL_LABEL = {
  admin: 'Administrador',
  profissional: 'Profissional',
  visualizador: 'Visualizador',
};

const hoje = () => {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
};

export default function Header({ onToggleSidebar }) {
  const { usuario } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 lg:left-60 z-20 h-16 bg-white border-b border-gray-200 flex items-center px-4 gap-4">
      <button
        className="btn btn-ghost p-2 lg:hidden"
        onClick={onToggleSidebar}
        aria-label="Menu"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 capitalize hidden sm:block">{hoje()}</p>
      </div>

      <div className="flex items-center gap-2">
        <button className="btn btn-ghost p-2 relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-500 rounded-full" />
        </button>

        <div className="flex items-center gap-2.5 pl-2 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white font-bold text-sm shrink-0">
            {usuario?.nome?.[0]?.toUpperCase()}
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-gray-900 leading-tight">{usuario?.nome}</p>
            <p className="text-xs text-gray-400">{PERFIL_LABEL[usuario?.perfil]}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

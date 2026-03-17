import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchX, LayoutDashboard, Users } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-[#1E3A8A]/8 flex items-center justify-center">
            <SearchX size={44} className="text-[#1E3A8A]/40" />
          </div>
        </div>
        <p className="text-8xl font-bold text-[#1E3A8A] mb-2 leading-none">404</p>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Página não encontrada</h1>
        <p className="text-gray-500 text-sm mb-8">
          A rota que você acessou não existe ou foi movida.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
            <LayoutDashboard size={16} />
            Ir ao Dashboard
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/acolhidos')}>
            <Users size={16} />
            Ver Acolhidos
          </button>
        </div>
        <p className="text-xs text-gray-300 mt-10">SIGA — Associação Beneficente Renascer em Cristo</p>
      </div>
    </div>
  );
}

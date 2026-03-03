import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-bold text-gray-200 mb-2">404</p>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Página não encontrada</h1>
        <p className="text-gray-500 text-sm mb-6">A rota que você acessou não existe.</p>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={16} />
          Voltar ao início
        </button>
      </div>
    </div>
  );
}

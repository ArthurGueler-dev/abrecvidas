import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl mb-6" role="img" aria-label="Página não encontrada">🔍</div>
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">404</h1>
        <p className="text-xl text-neutral-600 mb-8">Página não encontrada</p>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
          Voltar ao Início
        </button>
      </div>
    </div>
  );
}

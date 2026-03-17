import React from 'react';

export default function LoadingSpinner({ texto = 'Carregando...' }) {
  return (
    <div className="py-10 text-center text-gray-400">
      <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full mx-auto mb-3" />
      <p className="text-sm">{texto}</p>
    </div>
  );
}

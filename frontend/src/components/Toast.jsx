import React from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const icones = {
  success: <CheckCircle size={18} className="text-green-600" />,
  error:   <XCircle    size={18} className="text-red-600" />,
  warning: <AlertCircle size={18} className="text-amber-500" />,
};

const estilos = {
  success: 'border-l-4 border-green-500 bg-white',
  error:   'border-l-4 border-red-500 bg-white',
  warning: 'border-l-4 border-amber-400 bg-white',
};

export default function ToastContainer({ toasts }) {
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 w-80">
      {toasts.map((t) => (
        <div key={t.id} className={`flex items-start gap-3 p-4 rounded-lg shadow-lg ${estilos[t.tipo]} animate-fade-in`}>
          <span className="shrink-0 mt-0.5">{icones[t.tipo]}</span>
          <p className="text-sm text-gray-800 font-medium flex-1">{t.mensagem}</p>
        </div>
      ))}
    </div>
  );
}

import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ModalConfirmacao({ titulo, mensagem, onConfirmar, onCancelar, loading }) {
  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">{titulo}</h2>
        </div>
        <p className="text-sm text-gray-600 mb-6">{mensagem}</p>
        <div className="flex gap-3">
          <button className="btn btn-secondary flex-1" onClick={onCancelar} disabled={loading}>
            Cancelar
          </button>
          <button className="btn btn-danger flex-1" onClick={onConfirmar} disabled={loading}>
            {loading ? 'Removendo...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}

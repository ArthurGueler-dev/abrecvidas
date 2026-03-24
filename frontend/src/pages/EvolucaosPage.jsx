import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Eye } from 'lucide-react';
import api from '../services/api';

const TIPO_COR = {
  Geral:          'bg-teal-100 text-teal-700',
  Médica:         'bg-red-100 text-red-700',
  Psicológica:    'bg-purple-100 text-purple-700',
  Social:         'bg-blue-100 text-blue-700',
  Comportamental: 'bg-orange-100 text-orange-700',
  Familiar:       'bg-pink-100 text-pink-700',
  Jurídica:       'bg-yellow-100 text-yellow-700',
};

function formatarDataHora(v) {
  if (!v) return '—';
  return new Date(v).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function EvolucaosPage() {
  const [evolucoes, setEvolucoes] = useState([]);
  const [loading, setLoading]     = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/evolucoes?limit=100')
      .then(({ data }) => setEvolucoes(data.dados))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Evoluções</h1>
        <p className="text-gray-500 text-sm mt-0.5">Histórico de evoluções de todos os acolhidos</p>
      </div>

      <div className="card-p">
        {loading ? (
          <div className="py-16 text-center text-gray-400">
            <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full mx-auto mb-3" />
            Carregando...
          </div>
        ) : evolucoes.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <Activity size={36} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">Nenhuma evolução registrada</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200" />
            <div className="space-y-4">
              {evolucoes.map((e) => (
                <div key={e.id} className="relative pl-9">
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-2 border-teal-400 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-teal-400" />
                  </div>
                  <div className="border border-gray-200 rounded-xl p-3 hover:border-gray-300 transition-colors bg-white">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            className="text-sm font-semibold text-[#1E3A8A] hover:underline"
                            onClick={() => navigate(`/acolhidos/${e.acolhido_id}`)}
                          >
                            {e.acolhido_nome}
                          </button>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TIPO_COR[e.tipo] || 'bg-gray-100 text-gray-700'}`}>
                            {e.tipo}
                          </span>
                          <span className="text-xs text-gray-400">{formatarDataHora(e.criado_em)}</span>
                          {e.profissional_nome && (
                            <span className="text-xs text-gray-400">por {e.profissional_nome}</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-line line-clamp-3">{e.descricao}</p>
                      </div>
                      <button
                        className="p-1.5 rounded hover:bg-blue-100 text-blue-600 shrink-0"
                        title="Ver acolhido"
                        onClick={() => navigate(`/acolhidos/${e.acolhido_id}`)}
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

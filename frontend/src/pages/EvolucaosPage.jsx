import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Eye, Search, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../services/api';

const TIPOS = ['Geral', 'Médica', 'Psicológica', 'Social', 'Comportamental', 'Familiar', 'Jurídica'];

const TIPO_COR = {
  Geral:          'bg-teal-100 text-teal-700',
  Médica:         'bg-red-100 text-red-700',
  Psicológica:    'bg-purple-100 text-purple-700',
  Social:         'bg-blue-100 text-blue-700',
  Comportamental: 'bg-orange-100 text-orange-700',
  Familiar:       'bg-pink-100 text-pink-700',
  Jurídica:       'bg-yellow-100 text-yellow-700',
};

const POR_PAGINA = 15;

function formatarDataHora(v) {
  if (!v) return '—';
  return new Date(v).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function CardEvolucao({ e, onVerAcolhido }) {
  const [expandido, setExpandido] = useState(false);
  const longo = e.descricao?.length > 180;

  return (
    <div className="relative pl-9">
      <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-2 border-teal-400 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-teal-400" />
      </div>
      <div className="border border-gray-200 rounded-xl p-3 hover:border-gray-300 transition-colors bg-white">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                className="text-sm font-semibold text-[#1E3A8A] hover:underline"
                onClick={() => onVerAcolhido(e.acolhido_id)}
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

            <p className={`text-sm text-gray-700 whitespace-pre-line ${!expandido && longo ? 'line-clamp-3' : ''}`}>
              {e.descricao}
            </p>

            {longo && (
              <button
                className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium mt-0.5"
                onClick={() => setExpandido(v => !v)}
              >
                {expandido ? <><ChevronUp size={13} /> Mostrar menos</> : <><ChevronDown size={13} /> Ver tudo</>}
              </button>
            )}
          </div>
          <button
            className="p-1.5 rounded hover:bg-blue-100 text-blue-600 shrink-0"
            title="Ver acolhido"
            onClick={() => onVerAcolhido(e.acolhido_id)}
          >
            <Eye size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EvolucaosPage() {
  const [todas, setTodas]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [busca, setBusca]       = useState('');
  const [tipoFiltro, setTipo]   = useState('');
  const [pagina, setPagina]     = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/evolucoes?limit=500')
      .then(({ data }) => setTodas(data.dados))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtradas = useMemo(() => {
    let lista = todas;
    if (tipoFiltro) lista = lista.filter(e => e.tipo === tipoFiltro);
    if (busca.trim()) {
      const q = busca.toLowerCase();
      lista = lista.filter(e =>
        e.acolhido_nome?.toLowerCase().includes(q) ||
        e.descricao?.toLowerCase().includes(q)
      );
    }
    return lista;
  }, [todas, tipoFiltro, busca]);

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA));
  const paginaAtual  = Math.min(pagina, totalPaginas);
  const visiveis     = filtradas.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA);

  const setFiltro = (fn) => { fn(); setPagina(1); };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Evoluções</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {loading ? 'Carregando...' : `${filtradas.length} registro(s)`}
        </p>
      </div>

      {/* Filtros */}
      <div className="card-p flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input pl-9"
            placeholder="Buscar por acolhido ou descrição..."
            value={busca}
            onChange={(e) => setFiltro(() => setBusca(e.target.value))}
          />
        </div>
        <select
          className="input sm:w-48"
          value={tipoFiltro}
          onChange={(e) => setFiltro(() => setTipo(e.target.value))}
        >
          <option value="">Todos os tipos</option>
          {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Lista */}
      <div className="card-p">
        {loading ? (
          <div className="py-16 text-center text-gray-400">
            <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full mx-auto mb-3" />
            Carregando...
          </div>
        ) : filtradas.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <Activity size={36} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">Nenhuma evolução encontrada</p>
            {(busca || tipoFiltro) && (
              <button className="mt-2 text-sm text-teal-600 hover:underline"
                onClick={() => { setBusca(''); setTipo(''); setPagina(1); }}>
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200" />
              <div className="space-y-4">
                {visiveis.map((e) => (
                  <CardEvolucao
                    key={e.id}
                    e={e}
                    onVerAcolhido={(id) => navigate(`/acolhidos/${id}`)}
                  />
                ))}
              </div>
            </div>

            {/* Paginação */}
            {totalPaginas > 1 && (
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100 text-sm text-gray-600">
                <span>
                  {(paginaAtual - 1) * POR_PAGINA + 1}–{Math.min(paginaAtual * POR_PAGINA, filtradas.length)} de {filtradas.length}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    className="btn btn-secondary py-1.5 px-3"
                    onClick={() => setPagina(p => Math.max(1, p - 1))}
                    disabled={paginaAtual === 1}
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <span className="font-medium">{paginaAtual} / {totalPaginas}</span>
                  <button
                    className="btn btn-secondary py-1.5 px-3"
                    onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                    disabled={paginaAtual === totalPaginas}
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

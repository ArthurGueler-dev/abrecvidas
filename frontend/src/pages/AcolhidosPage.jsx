import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Search, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ModalConfirmacao from '../components/ModalConfirmacao';
import ToastContainer from '../components/Toast';
import { useToast } from '../hooks/useToast';

const STATUS_BADGE = {
  ativo:   'badge badge-green',
  inativo: 'badge badge-gray',
  alta:    'badge badge-blue',
};

function Avatar({ foto, nome }) {
  if (foto) return (
    <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
      <img src={foto} alt={nome} className="w-full h-full object-cover" />
    </div>
  );
  return (
    <div className="w-9 h-9 rounded-full bg-[#1E3A8A]/10 flex items-center justify-center text-[#1E3A8A] font-bold text-sm">
      {nome?.[0]?.toUpperCase()}
    </div>
  );
}

export default function AcolhidosPage() {
  const [acolhidos, setAcolhidos]     = useState([]);
  const [paginacao, setPaginacao]     = useState({});
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [status, setStatus]           = useState('');
  const [dataDe, setDataDe]           = useState('');
  const [dataAte, setDataAte]         = useState('');
  const [page, setPage]               = useState(1);
  const [deletando, setDeletando]     = useState(null);
  const [loadingDel, setLoadingDel]   = useState(false);
  const { isAdmin }                   = useAuth();
  const navigate                      = useNavigate();
  const { toasts, toast }             = useToast();

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (search)  params.set('search', search);
      if (status)  params.set('status', status);
      if (dataDe)  params.set('data_de', dataDe);
      if (dataAte) params.set('data_ate', dataAte);
      const { data } = await api.get(`/acolhidos?${params}`);
      setAcolhidos(data.dados);
      setPaginacao(data.paginacao);
    } catch {
      toast('Erro ao carregar acolhidos', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, status, dataDe, dataAte]);

  useEffect(() => { carregar(); }, [carregar]);

  const confirmarDelete = async () => {
    setLoadingDel(true);
    try {
      await api.delete(`/acolhidos/${deletando.id}`);
      toast(`${deletando.nome} removido com sucesso`, 'success');
      setDeletando(null);
      carregar();
    } catch {
      toast('Erro ao remover acolhido', 'error');
    } finally {
      setLoadingDel(false);
    }
  };

  return (
    <div className="space-y-5">
      <ToastContainer toasts={toasts} />

      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Acolhidos</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {paginacao.total !== undefined ? `${paginacao.total} registro(s) encontrado(s)` : 'Gerenciar cadastros'}
          </p>
        </div>
        <button className="btn btn-primary shrink-0" onClick={() => navigate('/acolhidos/novo')}>
          <UserPlus size={16} /> Novo Acolhido
        </button>
      </div>

      {/* Filtros */}
      <div className="card-p space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="input pl-9"
              placeholder="Buscar por nome ou CPF..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <select className="input sm:w-44" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            <option value="">Todos os status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
            <option value="alta">Alta</option>
          </select>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <span className="text-xs text-gray-400 shrink-0">Admissão:</span>
          <div className="flex gap-2 flex-1">
            <input className="input flex-1" type="date" value={dataDe}  title="Data de admissão — de" onChange={(e) => { setDataDe(e.target.value); setPage(1); }} />
            <input className="input flex-1" type="date" value={dataAte} title="Data de admissão — até" onChange={(e) => { setDataAte(e.target.value); setPage(1); }} />
          </div>
          {(dataDe || dataAte) && (
            <button className="text-xs text-gray-400 hover:text-red-500 transition-colors shrink-0"
              onClick={() => { setDataDe(''); setDataAte(''); setPage(1); }}>
              Limpar datas
            </button>
          )}
        </div>
      </div>

      {/* Tabela */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-gray-400">
            <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full mx-auto mb-3" />
            Carregando...
          </div>
        ) : acolhidos.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">Nenhum acolhido encontrado</p>
            <p className="text-sm mt-1">Tente ajustar os filtros ou cadastre um novo acolhido.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 w-10"></th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Nome</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden md:table-cell">CPF</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden lg:table-cell">Telefone</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden lg:table-cell">Admissão</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-600">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {acolhidos.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <Avatar foto={a.foto_url} nome={a.nome} />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900">{a.nome}</p>
                        <p className="text-xs text-gray-400 md:hidden">{a.cpf}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden md:table-cell font-mono">{a.cpf}</td>
                      <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">{a.telefone}</td>
                      <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">
                        {a.data_admissao ? new Date(a.data_admissao.toString().slice(0,10) + 'T12:00:00').toLocaleDateString('pt-BR') : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={STATUS_BADGE[a.status] || 'badge badge-gray'}>{a.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="Ver detalhes" onClick={() => navigate(`/acolhidos/${a.id}`)}>
                            <Eye size={15} />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-teal-50 text-teal-600 transition-colors" title="Editar" onClick={() => navigate(`/acolhidos/${a.id}/editar`)}>
                            <Pencil size={15} />
                          </button>
                          {isAdmin && (
                            <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Remover" onClick={() => setDeletando(a)}>
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            {paginacao.paginas > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm text-gray-600">
                <span>
                  {(page - 1) * 10 + 1}–{Math.min(page * 10, paginacao.total)} de {paginacao.total}
                </span>
                <div className="flex items-center gap-2">
                  <button className="btn btn-secondary py-1.5 px-3" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                    <ChevronLeft size={15} />
                  </button>
                  <span className="font-medium">{page} / {paginacao.paginas}</span>
                  <button className="btn btn-secondary py-1.5 px-3" onClick={() => setPage((p) => Math.min(paginacao.paginas, p + 1))} disabled={page === paginacao.paginas}>
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {deletando && (
        <ModalConfirmacao
          titulo="Remover Acolhido"
          mensagem={`Tem certeza que deseja remover "${deletando.nome}"? Esta ação não pode ser desfeita.`}
          onConfirmar={confirmarDelete}
          onCancelar={() => setDeletando(null)}
          loading={loadingDel}
        />
      )}
    </div>
  );
}

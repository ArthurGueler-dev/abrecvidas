import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, Activity } from 'lucide-react';
import api from '../../services/api';
import ModalConfirmacao from '../ModalConfirmacao';
import LoadingSpinner from '../LoadingSpinner';

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

function formatarDataHora(v) {
  if (!v) return '—';
  return new Date(v).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function TabEvolucao({ acolhidoId, podeEditar, toast }) {
  const [lista, setLista]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [form, setForm]           = useState(null);
  const [saving, setSaving]       = useState(false);
  const [confirmar, setConfirmar] = useState(null);

  const carregar = () => {
    setLoading(true);
    api.get(`/acolhidos/${acolhidoId}/evolucoes`)
      .then(({ data }) => setLista(data.dados))
      .catch(() => toast('Erro ao carregar evoluções', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { carregar(); }, [acolhidoId]);

  const set = (campo) => (e) => setForm(p => ({ ...p, [campo]: e.target.value }));

  const salvar = async () => {
    if (!form.descricao || form.descricao.trim().length < 3) {
      toast('Descrição é obrigatória', 'error'); return;
    }
    setSaving(true);
    try {
      if (form.id) {
        await api.put(`/acolhidos/${acolhidoId}/evolucoes/${form.id}`, form);
      } else {
        await api.post(`/acolhidos/${acolhidoId}/evolucoes`, form);
      }
      toast('Evolução salva', 'success');
      setForm(null);
      carregar();
    } catch {
      toast('Erro ao salvar evolução', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deletar = async (id) => {
    try {
      await api.delete(`/acolhidos/${acolhidoId}/evolucoes/${id}`);
      toast('Evolução removida', 'success');
      carregar();
    } catch {
      toast('Erro ao remover evolução', 'error');
    }
    setConfirmar(null);
  };

  return (
    <div className="card-p space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-teal-600" />
          <h2 className="font-semibold text-gray-900 text-sm">Registro de Evolução</h2>
          {lista.length > 0 && (
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{lista.length}</span>
          )}
        </div>
        {podeEditar && !form && (
          <button className="btn btn-primary text-xs py-1.5" onClick={() => setForm({ descricao: '', tipo: 'Geral' })}>
            <Plus size={14} /> Nova Evolução
          </button>
        )}
      </div>

      {/* Formulário */}
      {form && (
        <div className="bg-blue-50 rounded-xl p-4 space-y-3">
          <p className="text-sm font-semibold text-[#1E3A8A]">{form.id ? 'Editar Evolução' : 'Nova Evolução'}</p>
          <div>
            <label className="label">Tipo</label>
            <select className="input" value={form.tipo} onChange={set('tipo')}>
              {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Descrição / Observações *</label>
            <textarea
              className="input min-h-[120px] resize-y"
              value={form.descricao}
              onChange={set('descricao')}
              placeholder="Descreva a evolução, comportamento, intercorrências ou observações relevantes..."
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button className="btn btn-secondary text-xs" onClick={() => setForm(null)}><X size={14} /> Cancelar</button>
            <button className="btn btn-primary text-xs" onClick={salvar} disabled={saving}>
              {saving ? 'Salvando...' : <><Save size={14} /> Salvar</>}
            </button>
          </div>
        </div>
      )}

      {loading && <LoadingSpinner />}

      {!loading && lista.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-6">Nenhuma evolução registrada.</p>
      )}

      {/* Timeline */}
      {!loading && lista.length > 0 && (
        <div className="relative">
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200" />
          <div className="space-y-4">
            {lista.map((e) => (
              <div key={e.id} className="relative pl-9">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-2 border-teal-400 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-teal-400" />
                </div>
                <div className="border border-gray-200 rounded-xl p-3 hover:border-gray-300 transition-colors bg-white">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TIPO_COR[e.tipo] || 'bg-gray-100 text-gray-700'}`}>
                          {e.tipo}
                        </span>
                        <span className="text-xs text-gray-400">{formatarDataHora(e.criado_em)}</span>
                        {e.profissional_nome && (
                          <span className="text-xs text-gray-400">por {e.profissional_nome}</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-800 whitespace-pre-line">{e.descricao}</p>
                    </div>
                    {podeEditar && (
                      <div className="flex gap-1 shrink-0">
                        <button className="p-1.5 rounded hover:bg-blue-100 text-blue-600" onClick={() => setForm({ ...e })}>
                          <Pencil size={14} />
                        </button>
                        <button className="p-1.5 rounded hover:bg-red-100 text-red-500" onClick={() => setConfirmar(e.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {confirmar && (
        <ModalConfirmacao
          mensagem="Remover esta evolução?"
          onConfirmar={() => deletar(confirmar)}
          onCancelar={() => setConfirmar(null)}
        />
      )}
    </div>
  );
}

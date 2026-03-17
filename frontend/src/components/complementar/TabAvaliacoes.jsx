import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, ClipboardList } from 'lucide-react';
import api from '../../services/api';
import ModalConfirmacao from '../ModalConfirmacao';
import LoadingSpinner from '../LoadingSpinner';

const TIPOS = ['Psicológica', 'Social', 'Médica', 'Nutricional', 'Jurídica', 'Geral'];

const vazio = {
  data_avaliacao: new Date().toISOString().split('T')[0],
  tipo: 'Geral',
  descricao: '',
  plano_terapeutico: '',
  proxima_avaliacao: '',
};

function toData(v) {
  return v ? new Date(v.toString().slice(0, 10) + 'T12:00:00').toLocaleDateString('pt-BR') : null;
}

const TIPO_COR = {
  Psicológica: 'bg-purple-100 text-purple-700',
  Social:      'bg-blue-100 text-blue-700',
  Médica:      'bg-red-100 text-red-700',
  Nutricional: 'bg-orange-100 text-orange-700',
  Jurídica:    'bg-yellow-100 text-yellow-700',
  Geral:       'bg-teal-100 text-teal-700',
};

export default function TabAvaliacoes({ acolhidoId, podeEditar, toast }) {
  const [lista, setLista]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState(null);
  const [saving, setSaving]   = useState(false);
  const [confirmar, setConfirmar] = useState(null);

  const carregar = () => {
    setLoading(true);
    api.get(`/acolhidos/${acolhidoId}/avaliacoes`)
      .then(({ data }) => setLista(data.dados))
      .catch(() => toast('Erro ao carregar avaliações', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { carregar(); }, [acolhidoId]);

  const set = (campo) => (e) => setForm(p => ({ ...p, [campo]: e.target.value }));

  const salvar = async () => {
    if (!form.data_avaliacao || !form.tipo || !form.descricao) {
      toast('Data, tipo e descrição são obrigatórios', 'error'); return;
    }
    setSaving(true);
    try {
      const payload = { ...form, proxima_avaliacao: form.proxima_avaliacao || null };
      if (form.id) {
        await api.put(`/acolhidos/${acolhidoId}/avaliacoes/${form.id}`, payload);
      } else {
        await api.post(`/acolhidos/${acolhidoId}/avaliacoes`, payload);
      }
      toast('Avaliação salva', 'success');
      setForm(null);
      carregar();
    } catch {
      toast('Erro ao salvar avaliação', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deletar = async (id) => {
    try {
      await api.delete(`/acolhidos/${acolhidoId}/avaliacoes/${id}`);
      toast('Avaliação removida', 'success');
      carregar();
    } catch {
      toast('Erro ao remover avaliação', 'error');
    }
    setConfirmar(null);
  };

  return (
    <div className="card-p space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <ClipboardList size={16} className="text-teal-600" />
          <h2 className="font-semibold text-gray-900 text-sm">Avaliações Multiprofissionais</h2>
        </div>
        {podeEditar && !form && (
          <button className="btn btn-primary text-xs py-1.5" onClick={() => setForm({ ...vazio })}>
            <Plus size={14} /> Nova Avaliação
          </button>
        )}
      </div>

      {/* Formulário */}
      {form && (
        <div className="bg-blue-50 rounded-xl p-4 space-y-3">
          <p className="text-sm font-semibold text-[#1E3A8A]">{form.id ? 'Editar Avaliação' : 'Nova Avaliação'}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="label">Data *</label>
              <input className="input" type="date" value={form.data_avaliacao} onChange={set('data_avaliacao')} />
            </div>
            <div>
              <label className="label">Tipo *</label>
              <select className="input" value={form.tipo} onChange={set('tipo')}>
                {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Descrição / Observações *</label>
            <textarea className="input min-h-[100px] resize-y" value={form.descricao} onChange={set('descricao')} placeholder="Descreva a avaliação realizada..." />
          </div>
          <div>
            <label className="label">Plano terapêutico</label>
            <textarea className="input min-h-[70px] resize-y" value={form.plano_terapeutico} onChange={set('plano_terapeutico')} placeholder="Estratégias e metas definidas..." />
          </div>
          <div>
            <label className="label">Próxima avaliação</label>
            <input className="input" type="date" value={form.proxima_avaliacao} onChange={set('proxima_avaliacao')} />
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
        <p className="text-sm text-gray-400 text-center py-6">Nenhuma avaliação registrada.</p>
      )}

      {!loading && lista.length > 0 && (
        <div className="space-y-3">
          {lista.map(a => (
            <div key={a.id} className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TIPO_COR[a.tipo] || 'bg-gray-100 text-gray-700'}`}>
                      {a.tipo}
                    </span>
                    <span className="text-xs text-gray-400">{toData(a.data_avaliacao)}</span>
                    {a.profissional_nome && (
                      <span className="text-xs text-gray-400">por {a.profissional_nome}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-800 whitespace-pre-line">{a.descricao}</p>
                  {a.plano_terapeutico && (
                    <div>
                      <p className="text-xs text-gray-400 font-medium">Plano terapêutico</p>
                      <p className="text-sm text-gray-700 whitespace-pre-line">{a.plano_terapeutico}</p>
                    </div>
                  )}
                  {a.proxima_avaliacao && (
                    <p className="text-xs text-teal-600 font-medium">Próxima: {toData(a.proxima_avaliacao)}</p>
                  )}
                </div>
                {podeEditar && (
                  <div className="flex gap-1 shrink-0">
                    <button className="p-1.5 rounded hover:bg-blue-100 text-blue-600" onClick={() => setForm({
                      ...a,
                      data_avaliacao: a.data_avaliacao?.toString().slice(0, 10) || '',
                      proxima_avaliacao: a.proxima_avaliacao?.toString().slice(0, 10) || '',
                    })}>
                      <Pencil size={14} />
                    </button>
                    <button className="p-1.5 rounded hover:bg-red-100 text-red-500" onClick={() => setConfirmar(a.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmar && (
        <ModalConfirmacao
          mensagem="Remover esta avaliação?"
          onConfirmar={() => deletar(confirmar)}
          onCancelar={() => setConfirmar(null)}
        />
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, Users } from 'lucide-react';
import api from '../../services/api';
import ModalConfirmacao from '../ModalConfirmacao';

const PARENTESCOS = ['Pai', 'Mãe', 'Irmão', 'Irmã', 'Filho', 'Filha', 'Cônjuge', 'Avô', 'Avó', 'Tio', 'Tia', 'Outro'];
const SITUACOES   = ['Vivo(a)', 'Falecido(a)', 'Desconhecido(a)'];

const vazio = { nome: '', parentesco: 'Pai', idade: '', telefone: '', situacao: 'Vivo(a)', observacoes: '' };

function Linha({ label, valor }) {
  return (
    <div>
      <span className="text-xs text-gray-400">{label}: </span>
      <span className="text-sm text-gray-800">{valor || '—'}</span>
    </div>
  );
}

export default function TabFamilia({ acolhidoId, podeEditar, toast }) {
  const [lista, setLista]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState(null);   // null = fechado | {} = novo | {id,...} = editar
  const [saving, setSaving]   = useState(false);
  const [confirmar, setConfirmar] = useState(null);

  const carregar = () => {
    setLoading(true);
    api.get(`/acolhidos/${acolhidoId}/familia`)
      .then(({ data }) => setLista(data.dados))
      .catch(() => toast('Erro ao carregar família', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { carregar(); }, [acolhidoId]);

  const set = (campo) => (e) => setForm(prev => ({ ...prev, [campo]: e.target.value }));

  const salvar = async () => {
    if (!form.nome || !form.parentesco) {
      toast('Nome e parentesco são obrigatórios', 'error'); return;
    }
    setSaving(true);
    try {
      if (form.id) {
        await api.put(`/acolhidos/${acolhidoId}/familia/${form.id}`, form);
      } else {
        await api.post(`/acolhidos/${acolhidoId}/familia`, form);
      }
      toast('Familiar salvo com sucesso', 'success');
      setForm(null);
      carregar();
    } catch {
      toast('Erro ao salvar familiar', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deletar = async (id) => {
    try {
      await api.delete(`/acolhidos/${acolhidoId}/familia/${id}`);
      toast('Familiar removido', 'success');
      carregar();
    } catch {
      toast('Erro ao remover familiar', 'error');
    }
    setConfirmar(null);
  };

  return (
    <div className="card-p space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-teal-600" />
          <h2 className="font-semibold text-gray-900 text-sm">Informações Familiares</h2>
        </div>
        {podeEditar && !form && (
          <button className="btn btn-primary text-xs py-1.5" onClick={() => setForm({ ...vazio })}>
            <Plus size={14} /> Adicionar
          </button>
        )}
      </div>

      {/* Formulário inline */}
      {form && (
        <div className="bg-blue-50 rounded-xl p-4 space-y-3">
          <p className="text-sm font-semibold text-[#1E3A8A]">{form.id ? 'Editar Familiar' : 'Novo Familiar'}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="label">Nome *</label>
              <input className="input" value={form.nome} onChange={set('nome')} placeholder="Nome completo" />
            </div>
            <div>
              <label className="label">Parentesco *</label>
              <select className="input" value={form.parentesco} onChange={set('parentesco')}>
                {PARENTESCOS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Idade</label>
              <input className="input" type="number" min="0" max="120" value={form.idade} onChange={set('idade')} placeholder="Ex: 45" />
            </div>
            <div>
              <label className="label">Telefone</label>
              <input className="input" value={form.telefone} onChange={set('telefone')} placeholder="(00) 00000-0000" />
            </div>
            <div>
              <label className="label">Situação</label>
              <select className="input" value={form.situacao} onChange={set('situacao')}>
                {SITUACOES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Observações</label>
              <input className="input" value={form.observacoes} onChange={set('observacoes')} placeholder="Observações" />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button className="btn btn-secondary text-xs" onClick={() => setForm(null)}><X size={14} /> Cancelar</button>
            <button className="btn btn-primary text-xs" onClick={salvar} disabled={saving}>
              {saving ? 'Salvando...' : <><Save size={14} /> Salvar</>}
            </button>
          </div>
        </div>
      )}

      {loading && <p className="text-sm text-gray-400 text-center py-4">Carregando...</p>}

      {!loading && lista.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-6">Nenhum familiar cadastrado.</p>
      )}

      {!loading && lista.length > 0 && (
        <div className="space-y-2">
          {lista.map(f => (
            <div key={f.id} className="flex items-start justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-gray-900">{f.nome} <span className="text-xs font-normal text-teal-600 ml-1">({f.parentesco})</span></p>
                <Linha label="Situação" valor={f.situacao} />
                {f.idade && <Linha label="Idade" valor={`${f.idade} anos`} />}
                {f.telefone && <Linha label="Tel." valor={f.telefone} />}
                {f.observacoes && <Linha label="Obs." valor={f.observacoes} />}
              </div>
              {podeEditar && (
                <div className="flex gap-1 shrink-0 ml-3">
                  <button className="p-1.5 rounded hover:bg-blue-100 text-blue-600" onClick={() => setForm({ ...f })}>
                    <Pencil size={14} />
                  </button>
                  <button className="p-1.5 rounded hover:bg-red-100 text-red-500" onClick={() => setConfirmar(f.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {confirmar && (
        <ModalConfirmacao
          mensagem="Remover este familiar do cadastro?"
          onConfirmar={() => deletar(confirmar)}
          onCancelar={() => setConfirmar(null)}
        />
      )}
    </div>
  );
}

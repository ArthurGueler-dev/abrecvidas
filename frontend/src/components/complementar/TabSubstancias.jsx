import React, { useState, useEffect } from 'react';
import { Save, FlaskConical } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../LoadingSpinner';

const FREQUENCIAS = ['', 'Diário', 'Semanal', 'Mensal', 'Ocasional', 'Ex-usuário'];

const vazio = {
  usa_alcool: false, alcool_frequencia: '', alcool_tempo_uso: '',
  usa_drogas: false, drogas_tipos: '', drogas_tempo_uso: '',
  usa_medicamentos_abuso: false, medicamentos_tipos: '',
  internacoes_anteriores: 0, tentativas_recuperacao: 0,
  motivacao_tratamento: '', observacoes: '',
};

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div onClick={onChange} className={`w-10 h-5 rounded-full transition-colors relative ${checked ? 'bg-teal-500' : 'bg-gray-300'}`}>
        <div className={`w-4 h-4 bg-white rounded-full shadow absolute top-0.5 transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

function Campo({ label, children }) {
  return <div><label className="label">{label}</label>{children}</div>;
}

export default function TabSubstancias({ acolhidoId, podeEditar, toast }) {
  const [dados, setDados]     = useState(vazio);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    api.get(`/acolhidos/${acolhidoId}/substancias`)
      .then(({ data }) => {
        if (data.dados) setDados({ ...vazio, ...data.dados });
        else setEditando(true);
      })
      .catch(() => toast('Erro ao carregar dados de substâncias', 'error'))
      .finally(() => setLoading(false));
  }, [acolhidoId]);

  const set = (campo) => (e) => setDados(p => ({ ...p, [campo]: e.target.value }));
  const toggle = (campo) => () => setDados(p => ({ ...p, [campo]: !p[campo] }));

  const salvar = async () => {
    setSaving(true);
    try {
      const { data } = await api.put(`/acolhidos/${acolhidoId}/substancias`, dados);
      setDados({ ...vazio, ...data.dados });
      setEditando(false);
      toast('Histórico de substâncias salvo', 'success');
    } catch {
      toast('Erro ao salvar', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="card-p"><LoadingSpinner /></div>;

  return (
    <div className="card-p space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <FlaskConical size={16} className="text-teal-600" />
          <h2 className="font-semibold text-gray-900 text-sm">Histórico de Uso de Substâncias</h2>
        </div>
        {podeEditar && !editando && (
          <button className="btn btn-secondary text-xs py-1.5" onClick={() => setEditando(true)}>Editar</button>
        )}
      </div>

      {editando ? (
        <div className="space-y-5">
          {/* Álcool */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <Toggle label="Uso de Álcool" checked={!!dados.usa_alcool} onChange={toggle('usa_alcool')} />
            {dados.usa_alcool && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Campo label="Frequência">
                  <select className="input" value={dados.alcool_frequencia || ''} onChange={set('alcool_frequencia')}>
                    {FREQUENCIAS.map(f => <option key={f} value={f}>{f || 'Selecione'}</option>)}
                  </select>
                </Campo>
                <Campo label="Tempo de uso">
                  <input className="input" value={dados.alcool_tempo_uso || ''} onChange={set('alcool_tempo_uso')} placeholder="Ex: 5 anos" />
                </Campo>
              </div>
            )}
          </div>

          {/* Drogas */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <Toggle label="Uso de Drogas" checked={!!dados.usa_drogas} onChange={toggle('usa_drogas')} />
            {dados.usa_drogas && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Campo label="Tipos">
                  <input className="input" value={dados.drogas_tipos || ''} onChange={set('drogas_tipos')} placeholder="Ex: Maconha, cocaína..." />
                </Campo>
                <Campo label="Tempo de uso">
                  <input className="input" value={dados.drogas_tempo_uso || ''} onChange={set('drogas_tempo_uso')} placeholder="Ex: 3 anos" />
                </Campo>
              </div>
            )}
          </div>

          {/* Medicamentos */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <Toggle label="Abuso de Medicamentos" checked={!!dados.usa_medicamentos_abuso} onChange={toggle('usa_medicamentos_abuso')} />
            {dados.usa_medicamentos_abuso && (
              <Campo label="Tipos">
                <input className="input" value={dados.medicamentos_tipos || ''} onChange={set('medicamentos_tipos')} placeholder="Ex: Benzodiazepínicos..." />
              </Campo>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Campo label="Internações anteriores">
              <input className="input" type="number" min="0" value={dados.internacoes_anteriores || 0} onChange={set('internacoes_anteriores')} />
            </Campo>
            <Campo label="Tentativas de recuperação">
              <input className="input" type="number" min="0" value={dados.tentativas_recuperacao || 0} onChange={set('tentativas_recuperacao')} />
            </Campo>
          </div>

          <Campo label="Motivação para tratamento">
            <textarea className="input min-h-[70px] resize-y" value={dados.motivacao_tratamento || ''} onChange={set('motivacao_tratamento')} placeholder="O que motivou a buscar tratamento..." />
          </Campo>

          <Campo label="Observações">
            <textarea className="input min-h-[70px] resize-y" value={dados.observacoes || ''} onChange={set('observacoes')} placeholder="Informações adicionais..." />
          </Campo>

          <div className="flex gap-2 justify-end">
            <button className="btn btn-secondary text-xs" onClick={() => setEditando(false)}>Cancelar</button>
            <button className="btn btn-primary text-xs" onClick={salvar} disabled={saving}>
              {saving ? 'Salvando...' : <><Save size={14} /> Salvar</>}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            ['Álcool', dados.usa_alcool ? `Sim — ${dados.alcool_frequencia || ''} ${dados.alcool_tempo_uso ? `(${dados.alcool_tempo_uso})` : ''}`.trim() : 'Não'],
            ['Drogas', dados.usa_drogas ? `Sim — ${dados.drogas_tipos || ''}` : 'Não'],
            ['Medicamentos abuso', dados.usa_medicamentos_abuso ? `Sim — ${dados.medicamentos_tipos || ''}` : 'Não'],
            ['Internações anteriores', dados.internacoes_anteriores || '0'],
            ['Tentativas recuperação', dados.tentativas_recuperacao || '0'],
          ].map(([label, valor]) => (
            <div key={label}>
              <p className="text-xs text-gray-400 font-medium">{label}</p>
              <p className="text-sm text-gray-900 font-semibold mt-0.5">{valor || '—'}</p>
            </div>
          ))}
          {dados.motivacao_tratamento && (
            <div className="col-span-full">
              <p className="text-xs text-gray-400 font-medium">Motivação para tratamento</p>
              <p className="text-sm text-gray-900 mt-0.5 whitespace-pre-line">{dados.motivacao_tratamento}</p>
            </div>
          )}
          {dados.observacoes && (
            <div className="col-span-full">
              <p className="text-xs text-gray-400 font-medium">Observações</p>
              <p className="text-sm text-gray-900 mt-0.5 whitespace-pre-line">{dados.observacoes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

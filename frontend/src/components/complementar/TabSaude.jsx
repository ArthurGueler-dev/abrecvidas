import React, { useState, useEffect } from 'react';
import { Save, Heart } from 'lucide-react';
import api from '../../services/api';

const TIPOS_SANGUINEOS = ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const vazio = {
  tipo_sanguineo: '', alergias: '', medicamentos_em_uso: '',
  condicoes_cronicas: '', historico_psiquiatrico: '',
  tentativas_suicidio: false, numero_tentativas: 0,
  acompanhamento_psicologico: false, acompanhamento_psiquiatrico: false,
  observacoes: '',
};

function Campo({ label, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div
        onClick={onChange}
        className={`w-10 h-5 rounded-full transition-colors relative ${checked ? 'bg-teal-500' : 'bg-gray-300'}`}
      >
        <div className={`w-4 h-4 bg-white rounded-full shadow absolute top-0.5 transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

export default function TabSaude({ acolhidoId, podeEditar, toast }) {
  const [dados, setDados]   = useState(vazio);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    api.get(`/acolhidos/${acolhidoId}/saude`)
      .then(({ data }) => {
        if (data.dados) setDados({ ...vazio, ...data.dados });
        else setEditando(true);
      })
      .catch(() => toast('Erro ao carregar dados de saúde', 'error'))
      .finally(() => setLoading(false));
  }, [acolhidoId]);

  const set = (campo) => (e) => setDados(p => ({ ...p, [campo]: e.target.value }));
  const toggle = (campo) => () => setDados(p => ({ ...p, [campo]: !p[campo] }));

  const salvar = async () => {
    setSaving(true);
    try {
      const { data } = await api.put(`/acolhidos/${acolhidoId}/saude`, dados);
      setDados({ ...vazio, ...data.dados });
      setEditando(false);
      toast('Dados de saúde salvos', 'success');
    } catch {
      toast('Erro ao salvar', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="card-p text-sm text-gray-400 text-center py-6">Carregando...</div>;

  return (
    <div className="card-p space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Heart size={16} className="text-teal-600" />
          <h2 className="font-semibold text-gray-900 text-sm">Saúde e Medicamentos</h2>
        </div>
        {podeEditar && !editando && (
          <button className="btn btn-secondary text-xs py-1.5" onClick={() => setEditando(true)}>Editar</button>
        )}
      </div>

      {editando ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Campo label="Tipo Sanguíneo">
              <select className="input" value={dados.tipo_sanguineo} onChange={set('tipo_sanguineo')}>
                {TIPOS_SANGUINEOS.map(t => <option key={t} value={t}>{t || 'Não informado'}</option>)}
              </select>
            </Campo>
            <Campo label="Alergias">
              <input className="input" value={dados.alergias || ''} onChange={set('alergias')} placeholder="Ex: Penicilina, látex..." />
            </Campo>
            <Campo label="Medicamentos em uso">
              <input className="input" value={dados.medicamentos_em_uso || ''} onChange={set('medicamentos_em_uso')} placeholder="Ex: Ritalina 10mg..." />
            </Campo>
            <Campo label="Condições crônicas">
              <input className="input" value={dados.condicoes_cronicas || ''} onChange={set('condicoes_cronicas')} placeholder="Ex: Diabetes, hipertensão..." />
            </Campo>
          </div>

          <Campo label="Histórico psiquiátrico">
            <textarea className="input min-h-[80px] resize-y" value={dados.historico_psiquiatrico || ''} onChange={set('historico_psiquiatrico')} placeholder="Descreva diagnósticos, internações psiquiátricas..." />
          </Campo>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50 rounded-xl p-4">
            <Toggle label="Tentativas de suicídio" checked={!!dados.tentativas_suicidio} onChange={toggle('tentativas_suicidio')} />
            {dados.tentativas_suicidio && (
              <Campo label="Número de tentativas">
                <input className="input" type="number" min="0" value={dados.numero_tentativas || 0} onChange={set('numero_tentativas')} />
              </Campo>
            )}
            <Toggle label="Acompanhamento psicológico" checked={!!dados.acompanhamento_psicologico} onChange={toggle('acompanhamento_psicologico')} />
            <Toggle label="Acompanhamento psiquiátrico" checked={!!dados.acompanhamento_psiquiatrico} onChange={toggle('acompanhamento_psiquiatrico')} />
          </div>

          <Campo label="Observações">
            <textarea className="input min-h-[80px] resize-y" value={dados.observacoes || ''} onChange={set('observacoes')} placeholder="Informações adicionais..." />
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
            ['Tipo Sanguíneo', dados.tipo_sanguineo],
            ['Alergias', dados.alergias],
            ['Medicamentos', dados.medicamentos_em_uso],
            ['Condições Crônicas', dados.condicoes_cronicas],
            ['Tentativas de Suicídio', dados.tentativas_suicidio ? `Sim (${dados.numero_tentativas || 0}x)` : 'Não'],
            ['Acomp. Psicológico', dados.acompanhamento_psicologico ? 'Sim' : 'Não'],
            ['Acomp. Psiquiátrico', dados.acompanhamento_psiquiatrico ? 'Sim' : 'Não'],
          ].map(([label, valor]) => (
            <div key={label}>
              <p className="text-xs text-gray-400 font-medium">{label}</p>
              <p className="text-sm text-gray-900 font-semibold mt-0.5">{valor || '—'}</p>
            </div>
          ))}
          {dados.historico_psiquiatrico && (
            <div className="col-span-full">
              <p className="text-xs text-gray-400 font-medium">Histórico Psiquiátrico</p>
              <p className="text-sm text-gray-900 mt-0.5 whitespace-pre-line">{dados.historico_psiquiatrico}</p>
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

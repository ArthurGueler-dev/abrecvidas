import React, { useState, useEffect } from 'react';
import { Save, Briefcase } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../LoadingSpinner';

const ESCOLARIDADES = [
  '', 'Sem escolaridade', 'Fundamental incompleto', 'Fundamental completo',
  'Médio incompleto', 'Médio completo', 'Superior incompleto',
  'Superior completo', 'Pós-graduação',
];

const FONTES_RENDA = [
  '', 'Emprego formal', 'Autônomo', 'Bicos', 'Benefício social', 'Família', 'Sem renda',
];

const vazio = {
  escolaridade: '', ultima_ocupacao: '', area_atuacao: '',
  tempo_desempregado: '', fonte_renda: '', beneficios_sociais: '',
  habilidades: '', observacoes: '',
};

function Campo({ label, children }) {
  return <div><label className="label">{label}</label>{children}</div>;
}

export default function TabHistoricoProfissional({ acolhidoId, podeEditar, toast }) {
  const [dados, setDados]     = useState(vazio);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    api.get(`/acolhidos/${acolhidoId}/historico-profissional`)
      .then(({ data }) => {
        if (data.dados) setDados({ ...vazio, ...data.dados });
        else setEditando(true);
      })
      .catch(() => toast('Erro ao carregar histórico profissional', 'error'))
      .finally(() => setLoading(false));
  }, [acolhidoId]);

  const set = (campo) => (e) => setDados(p => ({ ...p, [campo]: e.target.value }));

  const salvar = async () => {
    setSaving(true);
    try {
      const { data } = await api.put(`/acolhidos/${acolhidoId}/historico-profissional`, dados);
      setDados({ ...vazio, ...data.dados });
      setEditando(false);
      toast('Histórico profissional salvo', 'success');
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
          <Briefcase size={16} className="text-teal-600" />
          <h2 className="font-semibold text-gray-900 text-sm">Histórico Profissional</h2>
        </div>
        {podeEditar && !editando && (
          <button className="btn btn-secondary text-xs py-1.5" onClick={() => setEditando(true)}>Editar</button>
        )}
      </div>

      {editando ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Campo label="Escolaridade">
              <select className="input" value={dados.escolaridade || ''} onChange={set('escolaridade')}>
                {ESCOLARIDADES.map(e => <option key={e} value={e}>{e || 'Selecione'}</option>)}
              </select>
            </Campo>
            <Campo label="Última ocupação">
              <input className="input" value={dados.ultima_ocupacao || ''} onChange={set('ultima_ocupacao')} placeholder="Ex: Pedreiro, auxiliar administrativo..." />
            </Campo>
            <Campo label="Área de atuação">
              <input className="input" value={dados.area_atuacao || ''} onChange={set('area_atuacao')} placeholder="Ex: Construção civil, comércio..." />
            </Campo>
            <Campo label="Tempo desempregado">
              <input className="input" value={dados.tempo_desempregado || ''} onChange={set('tempo_desempregado')} placeholder="Ex: 6 meses, 2 anos..." />
            </Campo>
            <Campo label="Fonte de renda">
              <select className="input" value={dados.fonte_renda || ''} onChange={set('fonte_renda')}>
                {FONTES_RENDA.map(f => <option key={f} value={f}>{f || 'Selecione'}</option>)}
              </select>
            </Campo>
            <Campo label="Benefícios sociais">
              <input className="input" value={dados.beneficios_sociais || ''} onChange={set('beneficios_sociais')} placeholder="Ex: Bolsa Família, BPC..." />
            </Campo>
          </div>

          <Campo label="Habilidades">
            <textarea className="input min-h-[70px] resize-y" value={dados.habilidades || ''} onChange={set('habilidades')} placeholder="Habilidades, cursos, certificados..." />
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
            ['Escolaridade', dados.escolaridade],
            ['Última Ocupação', dados.ultima_ocupacao],
            ['Área de Atuação', dados.area_atuacao],
            ['Tempo Desempregado', dados.tempo_desempregado],
            ['Fonte de Renda', dados.fonte_renda],
            ['Benefícios Sociais', dados.beneficios_sociais],
          ].map(([label, valor]) => (
            <div key={label}>
              <p className="text-xs text-gray-400 font-medium">{label}</p>
              <p className="text-sm text-gray-900 font-semibold mt-0.5">{valor || '—'}</p>
            </div>
          ))}
          {dados.habilidades && (
            <div className="col-span-full">
              <p className="text-xs text-gray-400 font-medium">Habilidades</p>
              <p className="text-sm text-gray-900 mt-0.5 whitespace-pre-line">{dados.habilidades}</p>
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

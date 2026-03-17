import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Pencil, User, Phone, MapPin, Upload,
  Users, Heart, FlaskConical, Briefcase, ClipboardList,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ToastContainer from '../components/Toast';
import { useToast } from '../hooks/useToast';
import TabFamilia from '../components/complementar/TabFamilia';
import TabSaude from '../components/complementar/TabSaude';
import TabSubstancias from '../components/complementar/TabSubstancias';
import TabHistoricoProfissional from '../components/complementar/TabHistoricoProfissional';
import TabAvaliacoes from '../components/complementar/TabAvaliacoes';

const STATUS_BADGE = {
  ativo:   'badge badge-green',
  inativo: 'badge badge-gray',
  alta:    'badge badge-blue',
};

const TABS = [
  { id: 'dados',       label: 'Dados Pessoais',      icone: User },
  { id: 'familia',     label: 'Família',              icone: Users },
  { id: 'saude',       label: 'Saúde',                icone: Heart },
  { id: 'substancias', label: 'Substâncias',          icone: FlaskConical },
  { id: 'profissional',label: 'Histórico Prof.',      icone: Briefcase },
  { id: 'avaliacoes',  label: 'Avaliações',           icone: ClipboardList },
];

function Info({ label, valor }) {
  return (
    <div>
      <p className="text-xs text-gray-400 font-medium">{label}</p>
      <p className="text-sm text-gray-900 font-semibold mt-0.5">{valor || '—'}</p>
    </div>
  );
}

function toData(v) {
  return v ? new Date(v.toString().slice(0, 10) + 'T12:00:00').toLocaleDateString('pt-BR') : null;
}

export default function DetalhesAcolhidoPage() {
  const { id }              = useParams();
  const [acolhido, setAcolhido] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('dados');
  const navigate                = useNavigate();
  const { isAdmin, isProfissional } = useAuth();
  const { toasts, toast }       = useToast();
  const podeEditar = isAdmin || isProfissional;

  const carregar = () => {
    setLoading(true);
    api.get(`/acolhidos/${id}`)
      .then(({ data }) => setAcolhido(data.dados))
      .catch(() => navigate('/acolhidos'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { carregar(); }, [id]);

  const handleFoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadLoading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      await api.post(`/acolhidos/${id}/foto`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast('Foto atualizada com sucesso!', 'success');
      carregar();
    } catch {
      toast('Erro ao enviar foto', 'error');
    } finally {
      setUploadLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-400">
        <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full mx-auto mb-3" />
        Carregando...
      </div>
    );
  }

  if (!acolhido) return null;

  const idade = acolhido.data_nascimento
    ? Math.floor((new Date() - new Date(acolhido.data_nascimento)) / (365.25 * 24 * 3600 * 1000))
    : null;

  return (
    <div className="space-y-5">
      <ToastContainer toasts={toasts} />

      {/* Header */}
      <div className="flex items-center gap-3">
        <button className="btn btn-ghost p-2" onClick={() => navigate('/acolhidos')}>
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{acolhido.nome}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={STATUS_BADGE[acolhido.status] || 'badge badge-gray'}>{acolhido.status}</span>
            {idade && <span className="text-sm text-gray-400">{idade} anos</span>}
          </div>
        </div>
        {podeEditar && (
          <button className="btn btn-secondary" onClick={() => navigate(`/acolhidos/${id}/editar`)}>
            <Pencil size={16} /> Editar
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

        {/* Sidebar — foto + resumo */}
        <div className="card-p flex flex-col items-center text-center gap-4">
          <div className="relative">
            {acolhido.foto_url
              ? <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md">
                  <img src={acolhido.foto_url} alt={acolhido.nome} className="w-full h-full object-cover" />
                </div>
              : <div className="w-28 h-28 rounded-full bg-[#1E3A8A]/10 flex items-center justify-center border-4 border-white shadow-md">
                  <User size={40} className="text-[#1E3A8A]/40" />
                </div>
            }
            {podeEditar && (
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-teal-600 transition-colors">
                {uploadLoading
                  ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  : <Upload size={14} className="text-white" />
                }
                <input type="file" accept="image/*" className="hidden" onChange={handleFoto} />
              </label>
            )}
          </div>
          <div>
            <p className="font-bold text-gray-900">{acolhido.nome}</p>
            <p className="text-sm text-gray-400">{acolhido.cpf}</p>
          </div>
          <div className="w-full space-y-2 text-left">
            <Info label="Admissão" valor={toData(acolhido.data_admissao)} />
            {acolhido.data_alta && <Info label="Alta" valor={toData(acolhido.data_alta)} />}
            <Info label="Cadastrado por" valor={acolhido.criado_por_nome} />
          </div>
        </div>

        {/* Conteúdo com abas */}
        <div className="lg:col-span-3 space-y-4">

          {/* Abas */}
          <div className="flex flex-wrap gap-1 bg-gray-100 rounded-xl p-1">
            {TABS.map(({ id: tabId, label, icone: Icon }) => (
              <button
                key={tabId}
                onClick={() => setAbaAtiva(tabId)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  abaAtiva === tabId
                    ? 'bg-white text-[#1E3A8A] shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          {/* Aba: Dados Pessoais */}
          {abaAtiva === 'dados' && (
            <div className="space-y-4">
              <div className="card-p">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                  <User size={16} className="text-teal-600" />
                  <h2 className="font-semibold text-gray-900 text-sm">Dados Pessoais</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <Info label="Nome" valor={acolhido.nome} />
                  <Info label="CPF" valor={acolhido.cpf} />
                  <Info label="RG" valor={acolhido.rg} />
                  <Info label="Data de Nascimento" valor={toData(acolhido.data_nascimento)} />
                  <Info label="Sexo" valor={acolhido.sexo === 'M' ? 'Masculino' : acolhido.sexo === 'F' ? 'Feminino' : acolhido.sexo} />
                  <Info label="Estado Civil" valor={acolhido.estado_civil} />
                </div>
              </div>
              <div className="card-p">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                  <Phone size={16} className="text-teal-600" />
                  <h2 className="font-semibold text-gray-900 text-sm">Contato</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <Info label="Telefone" valor={acolhido.telefone} />
                  <Info label="Telefone 2" valor={acolhido.telefone_secundario} />
                  <Info label="E-mail" valor={acolhido.email} />
                </div>
              </div>
              <div className="card-p">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                  <MapPin size={16} className="text-teal-600" />
                  <h2 className="font-semibold text-gray-900 text-sm">Endereço</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <Info label="Endereço" valor={acolhido.endereco} />
                  <Info label="CEP" valor={acolhido.cep} />
                  <Info label="Cidade / UF" valor={
                    acolhido.cidade && acolhido.estado
                      ? `${acolhido.cidade} / ${acolhido.estado}`
                      : acolhido.cidade || acolhido.estado
                  } />
                </div>
              </div>
            </div>
          )}

          {abaAtiva === 'familia'      && <TabFamilia      acolhidoId={id} podeEditar={podeEditar} toast={toast} />}
          {abaAtiva === 'saude'        && <TabSaude        acolhidoId={id} podeEditar={podeEditar} toast={toast} />}
          {abaAtiva === 'substancias'  && <TabSubstancias  acolhidoId={id} podeEditar={podeEditar} toast={toast} />}
          {abaAtiva === 'profissional' && <TabHistoricoProfissional acolhidoId={id} podeEditar={podeEditar} toast={toast} />}
          {abaAtiva === 'avaliacoes'   && <TabAvaliacoes   acolhidoId={id} podeEditar={podeEditar} toast={toast} />}

        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, User } from 'lucide-react';

const ESTADOS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

const estadosCivis = ['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União Estável'];

function Campo({ label, erro, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {erro && <p className="text-red-500 text-xs mt-1">{erro}</p>}
    </div>
  );
}

function formatarCPFInput(valor) {
  const n = valor.replace(/\D/g, '').slice(0, 11);
  return n.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (_, a, b, c, d) =>
    d ? `${a}.${b}.${c}-${d}` : c ? `${a}.${b}.${c}` : b ? `${a}.${b}` : a
  );
}

function formatarTelefoneInput(valor) {
  const n = valor.replace(/\D/g, '').slice(0, 11);
  if (n.length <= 10) return n.replace(/(\d{2})(\d{4})(\d{0,4})/, (_, a, b, c) => c ? `(${a}) ${b}-${c}` : b ? `(${a}) ${b}` : a);
  return n.replace(/(\d{2})(\d{5})(\d{0,4})/, (_, a, b, c) => c ? `(${a}) ${b}-${c}` : b ? `(${a}) ${b}` : a);
}

function formatarCEP(valor) {
  const n = valor.replace(/\D/g, '').slice(0, 8);
  return n.replace(/(\d{5})(\d{0,3})/, (_, a, b) => b ? `${a}-${b}` : a);
}

export default function FormAcolhido({ acolhido = null, onSubmit, loading, erros = {} }) {
  const navigate = useNavigate();
  const [dados, setDados] = useState(acolhido || {
    nome: '', cpf: '', rg: '', data_nascimento: '',
    sexo: 'M', estado_civil: '', telefone: '', telefone_secundario: '',
    email: '', endereco: '', cep: '', cidade: '', estado: '',
    data_admissao: new Date().toISOString().split('T')[0],
  });

  const set = (campo) => (e) => {
    let valor = e.target.value;
    if (campo === 'cpf') valor = formatarCPFInput(valor);
    if (campo === 'telefone' || campo === 'telefone_secundario') valor = formatarTelefoneInput(valor);
    if (campo === 'cep') valor = formatarCEP(valor);
    setDados((prev) => ({ ...prev, [campo]: valor }));
  };

  const buscarCEP = async () => {
    const cep = dados.cep.replace(/\D/g, '');
    if (cep.length !== 8) return;
    try {
      const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const d = await r.json();
      if (!d.erro) {
        setDados((prev) => ({
          ...prev,
          endereco: d.logradouro || prev.endereco,
          cidade: d.localidade || prev.cidade,
          estado: d.uf || prev.estado,
        }));
      }
    } catch { /* ignora */ }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(dados); }} className="space-y-6">

      {/* Dados Pessoais */}
      <div className="card-p">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
          <User size={18} className="text-teal-600" />
          <h2 className="font-semibold text-gray-900">Dados Pessoais</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Campo label="Nome completo *" erro={erros.nome}>
            <input className={`input ${erros.nome ? 'input-error' : ''}`} value={dados.nome} onChange={set('nome')} placeholder="Nome completo" required />
          </Campo>
          <Campo label="CPF *" erro={erros.cpf}>
            <input className={`input ${erros.cpf ? 'input-error' : ''}`} value={dados.cpf} onChange={set('cpf')} placeholder="000.000.000-00" required />
          </Campo>
          <Campo label="RG" erro={erros.rg}>
            <input className={`input ${erros.rg ? 'input-error' : ''}`} value={dados.rg} onChange={set('rg')} placeholder="00.000.000-0" />
          </Campo>
          <Campo label="Data de Nascimento">
            <input className="input" type="date" value={dados.data_nascimento} onChange={set('data_nascimento')} />
          </Campo>
          <Campo label="Sexo">
            <select className="input" value={dados.sexo} onChange={set('sexo')}>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
          </Campo>
          <Campo label="Estado Civil">
            <select className="input" value={dados.estado_civil} onChange={set('estado_civil')}>
              <option value="">Selecione</option>
              {estadosCivis.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </Campo>
        </div>
      </div>

      {/* Contato */}
      <div className="card-p">
        <h2 className="font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">Contato</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Campo label="Telefone principal *" erro={erros.telefone}>
            <input className={`input ${erros.telefone ? 'input-error' : ''}`} value={dados.telefone} onChange={set('telefone')} placeholder="(00) 00000-0000" required />
          </Campo>
          <Campo label="Telefone secundário">
            <input className="input" value={dados.telefone_secundario} onChange={set('telefone_secundario')} placeholder="(00) 00000-0000" />
          </Campo>
          <Campo label="E-mail" erro={erros.email}>
            <input className={`input ${erros.email ? 'input-error' : ''}`} type="email" value={dados.email} onChange={set('email')} placeholder="email@exemplo.com" />
          </Campo>
        </div>
      </div>

      {/* Endereço */}
      <div className="card-p">
        <h2 className="font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">Endereço</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Campo label="CEP">
            <input className="input" value={dados.cep} onChange={set('cep')} onBlur={buscarCEP} placeholder="00000-000" />
          </Campo>
          <Campo label="Endereço">
            <input className="input" value={dados.endereco} onChange={set('endereco')} placeholder="Rua, número, bairro" />
          </Campo>
          <Campo label="Cidade">
            <input className="input" value={dados.cidade} onChange={set('cidade')} placeholder="Cidade" />
          </Campo>
          <Campo label="Estado">
            <select className="input" value={dados.estado} onChange={set('estado')}>
              <option value="">Selecione</option>
              {ESTADOS.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
            </select>
          </Campo>
        </div>
      </div>

      {/* Internação */}
      <div className="card-p">
        <h2 className="font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">Internação</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Campo label="Data de Admissão *">
            <input className="input" type="date" value={dados.data_admissao} onChange={set('data_admissao')} required />
          </Campo>
          {acolhido && (
            <>
              <Campo label="Data de Alta">
                <input className="input" type="date" value={dados.data_alta || ''} onChange={set('data_alta')} />
              </Campo>
              <Campo label="Status">
                <select className="input" value={dados.status} onChange={set('status')}>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="alta">Alta</option>
                </select>
              </Campo>
            </>
          )}
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-3 justify-end pb-4">
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/acolhidos')}>
          <X size={16} /> Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Salvando...' : <><Save size={16} /> {acolhido ? 'Salvar Alterações' : 'Cadastrar Acolhido'}</>}
        </button>
      </div>
    </form>
  );
}

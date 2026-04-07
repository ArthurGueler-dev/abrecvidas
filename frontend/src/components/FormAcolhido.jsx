import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, User } from 'lucide-react';

const ESTADOS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

const TODOS_ESTADOS_CIVIS = ['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União Estável'];

// ─── Validadores inline ──────────────────────────────────────────────────────

function cpfValido(cpf) {
  cpf = cpf.replace(/[^\d]/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let soma = 0;
  for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf[10]);
}

function rgValido(rg) {
  return /^\d{1,3}\.?\d{3}\.?\d{3}-?\d{1}$/.test(rg.replace(/\s/g, ''));
}

function calcularIdade(dataNasc) {
  if (!dataNasc) return null;
  const hoje = new Date();
  const nasc = new Date(dataNasc + 'T12:00:00');
  if (isNaN(nasc)) return null;
  let idade = hoje.getFullYear() - nasc.getFullYear();
  if (hoje.getMonth() < nasc.getMonth() ||
     (hoje.getMonth() === nasc.getMonth() && hoje.getDate() < nasc.getDate())) {
    idade--;
  }
  return idade;
}

function estadosCivisPermitidos(dataNasc) {
  const idade = calcularIdade(dataNasc);
  if (idade === null) return TODOS_ESTADOS_CIVIS;
  if (idade < 16)  return ['Solteiro(a)'];
  if (idade < 18)  return ['Solteiro(a)', 'Casado(a)', 'União Estável'];
  return TODOS_ESTADOS_CIVIS;
}

// ─── Formatadores ────────────────────────────────────────────────────────────

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

function formatarRGInput(valor) {
  const n = valor.replace(/\D/g, '').slice(0, 9);
  if (n.length <= 2) return n;
  if (n.length <= 5) return n.replace(/(\d{2})(\d+)/, '$1.$2');
  if (n.length <= 8) return n.replace(/(\d{2})(\d{3})(\d+)/, '$1.$2.$3');
  return n.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
}

function formatarCEP(valor) {
  const n = valor.replace(/\D/g, '').slice(0, 8);
  return n.replace(/(\d{5})(\d{0,3})/, (_, a, b) => b ? `${a}-${b}` : a);
}

// ─── Componente Campo ────────────────────────────────────────────────────────

function Campo({ label, erro, aviso, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {erro  && <p className="text-red-500 text-xs mt-1 flex items-center gap-1">⛔ {erro}</p>}
      {!erro && aviso && <p className="text-amber-500 text-xs mt-1 flex items-center gap-1">⚠️ {aviso}</p>}
    </div>
  );
}

// ─── Formulário principal ────────────────────────────────────────────────────

export default function FormAcolhido({ acolhido = null, onSubmit, loading, erros = {} }) {
  const navigate = useNavigate();
  const [dados, setDados] = useState(acolhido || {
    nome: '', cpf: '', rg: '', data_nascimento: '',
    sexo: 'M', estado_civil: '', telefone: '', telefone_secundario: '',
    email: '', endereco: '', cep: '', cidade: '', estado: '',
    data_admissao: new Date().toISOString().split('T')[0],
  });

  const [semMoradia, setSemMoradia] = useState(
    acolhido
      ? (!acolhido.endereco && !acolhido.cep && !acolhido.cidade && !acolhido.estado)
      : false
  );

  const [errosLocais, setErrosLocais] = useState({});

  const setErroLocal = (campo, msg) =>
    setErrosLocais(prev => msg ? { ...prev, [campo]: msg } : (({ [campo]: _, ...rest }) => rest)(prev));

  // ── handlers de campo ──────────────────────────────────────────────────────

  const set = (campo) => (e) => {
    let valor = e.target.value;
    if (campo === 'cpf')    valor = formatarCPFInput(valor);
    if (campo === 'rg')     valor = formatarRGInput(valor);
    if (campo === 'telefone' || campo === 'telefone_secundario') valor = formatarTelefoneInput(valor);
    if (campo === 'cep')    valor = formatarCEP(valor);

    // Ao mudar data de nascimento, limpa estado civil incompatível
    if (campo === 'data_nascimento') {
      const permitidos = estadosCivisPermitidos(valor);
      setDados(prev => ({
        ...prev,
        [campo]: valor,
        estado_civil: permitidos.includes(prev.estado_civil) ? prev.estado_civil : '',
      }));
      validarIdade(valor);
      return;
    }

    // Limpa erro local quando o usuário começa a digitar novamente
    if (campo === 'cpf' || campo === 'rg') setErroLocal(campo, null);

    setDados(prev => ({ ...prev, [campo]: valor }));
  };

  // ── validação ao sair do campo (onBlur) ───────────────────────────────────

  const validarCPF = () => {
    if (!dados.cpf) return;
    const digits = dados.cpf.replace(/\D/g, '');
    if (digits.length < 11) {
      setErroLocal('cpf', 'CPF incompleto — digite os 11 dígitos');
    } else if (!cpfValido(dados.cpf)) {
      setErroLocal('cpf', 'CPF inválido — verifique os dígitos');
    } else {
      setErroLocal('cpf', null);
    }
  };

  const validarRG = () => {
    if (!dados.rg) return;
    if (!rgValido(dados.rg)) {
      setErroLocal('rg', 'RG inválido — formato esperado: 00.000.000-0');
    } else {
      setErroLocal('rg', null);
    }
  };

  const validarIdade = (dataNasc) => {
    const dn = dataNasc !== undefined ? dataNasc : dados.data_nascimento;
    if (!dn) { setErroLocal('data_nascimento', null); return; }
    const idade = calcularIdade(dn);
    if (idade === null) { setErroLocal('data_nascimento', 'Data inválida'); return; }
    if (idade < 0)  { setErroLocal('data_nascimento', 'Data de nascimento não pode ser no futuro'); return; }
    if (idade > 120) { setErroLocal('data_nascimento', 'Idade acima de 120 anos — verifique a data'); return; }
    setErroLocal('data_nascimento', null);
  };

  // ── opções de estado civil filtradas por idade ────────────────────────────

  const estadosCivisDisponiveis = estadosCivisPermitidos(dados.data_nascimento);
  const idade = calcularIdade(dados.data_nascimento);
  const avisoIdade = idade !== null && idade < 16
    ? `Menor de 16 anos — apenas "Solteiro(a)" permitido`
    : idade !== null && idade < 18
    ? `Menor de 18 anos — opções de estado civil limitadas`
    : null;

  // ── Sem moradia ───────────────────────────────────────────────────────────

  const toggleSemMoradia = () => {
    setSemMoradia(prev => {
      if (!prev) {
        // ao marcar: limpa os campos de endereço
        setDados(d => ({ ...d, endereco: '', cep: '', cidade: '', estado: '' }));
      }
      return !prev;
    });
  };

  // ── CEP ───────────────────────────────────────────────────────────────────

  const buscarCEP = async () => {
    const cep = dados.cep.replace(/\D/g, '');
    if (cep.length !== 8) return;
    try {
      const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const d = await r.json();
      if (!d.erro) {
        setDados(prev => ({
          ...prev,
          endereco: d.logradouro || prev.endereco,
          cidade: d.localidade || prev.cidade,
          estado: d.uf || prev.estado,
        }));
      }
    } catch { /* ignora */ }
  };

  // ── limpeza antes do envio ────────────────────────────────────────────────

  const camposOpcionais = [
    'rg', 'data_nascimento', 'estado_civil', 'telefone_secundario',
    'email', 'endereco', 'cep', 'cidade', 'estado', 'data_alta',
  ];

  const limpar = (d) => {
    const copia = { ...d };
    camposOpcionais.forEach((k) => {
      if (copia[k] === '' || copia[k] === undefined) copia[k] = null;
    });
    return copia;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Bloqueia envio se houver erros locais
    if (Object.keys(errosLocais).length > 0) return;
    onSubmit(limpar(dados));
  };

  const errosCombinados = { ...errosLocais, ...erros };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Dados Pessoais */}
      <div className="card-p">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
          <User size={18} className="text-teal-600" />
          <h2 className="font-semibold text-gray-900">Dados Pessoais</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          <Campo label="Nome completo *" erro={errosCombinados.nome}>
            <input
              className={`input ${errosCombinados.nome ? 'input-error' : ''}`}
              value={dados.nome}
              onChange={set('nome')}
              placeholder="Nome completo"
              required
            />
          </Campo>

          <Campo label="CPF *" erro={errosCombinados.cpf}>
            <input
              className={`input ${errosCombinados.cpf ? 'input-error' : ''}`}
              value={dados.cpf}
              onChange={set('cpf')}
              onBlur={validarCPF}
              placeholder="000.000.000-00"
              required
            />
          </Campo>

          <Campo label="RG" erro={errosCombinados.rg}>
            <input
              className={`input ${errosCombinados.rg ? 'input-error' : ''}`}
              value={dados.rg}
              onChange={set('rg')}
              onBlur={validarRG}
              placeholder="00.000.000-0"
            />
          </Campo>

          <Campo label="Data de Nascimento" erro={errosCombinados.data_nascimento} aviso={avisoIdade}>
            <input
              className={`input ${errosCombinados.data_nascimento ? 'input-error' : ''}`}
              type="date"
              value={dados.data_nascimento}
              onChange={set('data_nascimento')}
              onBlur={() => validarIdade()}
            />
          </Campo>

          <Campo label="Sexo">
            <select className="input" value={dados.sexo} onChange={set('sexo')}>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
          </Campo>

          <Campo label="Estado Civil">
            <select
              className="input"
              value={dados.estado_civil}
              onChange={set('estado_civil')}
            >
              <option value="">Selecione</option>
              {estadosCivisDisponiveis.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </Campo>

        </div>
      </div>

      {/* Contato */}
      <div className="card-p">
        <h2 className="font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">Contato</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Campo label="Telefone principal *" erro={errosCombinados.telefone}>
            <input
              className={`input ${errosCombinados.telefone ? 'input-error' : ''}`}
              value={dados.telefone}
              onChange={set('telefone')}
              placeholder="(00) 00000-0000"
              required
            />
          </Campo>
          <Campo label="Telefone secundário">
            <input className="input" value={dados.telefone_secundario} onChange={set('telefone_secundario')} placeholder="(00) 00000-0000" />
          </Campo>
          <Campo label="E-mail" erro={errosCombinados.email}>
            <input className={`input ${errosCombinados.email ? 'input-error' : ''}`} type="email" value={dados.email} onChange={set('email')} placeholder="email@exemplo.com" />
          </Campo>
        </div>
      </div>

      {/* Endereço */}
      <div className="card-p">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Endereço</h2>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={semMoradia}
              onChange={toggleSemMoradia}
              className="w-4 h-4 rounded accent-red-500 cursor-pointer"
            />
            <span className="text-sm font-medium text-red-600">Sem moradia fixa</span>
          </label>
        </div>

        {semMoradia ? (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <span className="text-red-500 text-lg">🏠</span>
            <p className="text-sm text-red-700 font-medium">
              Acolhido sem moradia fixa — campos de endereço não serão preenchidos.
            </p>
          </div>
        ) : (
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
        )}
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
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || Object.keys(errosLocais).length > 0}
        >
          {loading ? 'Salvando...' : <><Save size={16} /> {acolhido ? 'Salvar Alterações' : 'Cadastrar Acolhido'}</>}
        </button>
      </div>

    </form>
  );
}

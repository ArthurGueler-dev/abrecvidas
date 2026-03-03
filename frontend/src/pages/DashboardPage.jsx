import React from 'react';
import { Users, UserCheck, UserMinus, UserPlus, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const statCards = [
  {
    titulo: 'Total de Acolhidos',
    valor: '—',
    icone: Users,
    cor: 'border-t-[#1E3A8A]',
    corIcone: 'bg-blue-50 text-[#1E3A8A]',
    descricao: 'Ativos no sistema',
  },
  {
    titulo: 'Acolhidos Ativos',
    valor: '—',
    icone: UserCheck,
    cor: 'border-t-teal-500',
    corIcone: 'bg-teal-50 text-teal-600',
    descricao: 'Em acompanhamento',
  },
  {
    titulo: 'Altas no Mês',
    valor: '—',
    icone: UserMinus,
    cor: 'border-t-green-500',
    corIcone: 'bg-green-50 text-green-600',
    descricao: 'Concluíram o tratamento',
  },
  {
    titulo: 'Novos Acolhimentos',
    valor: '—',
    icone: UserPlus,
    cor: 'border-t-amber-400',
    corIcone: 'bg-amber-50 text-amber-600',
    descricao: 'Nos últimos 30 dias',
  },
];

const proximasAtividades = [
  { label: 'Consulta médica', horario: '09:00', tipo: 'saude' },
  { label: 'Reunião de equipe', horario: '14:00', tipo: 'reuniao' },
  { label: 'Avaliação multiprofissional', horario: '16:30', tipo: 'avaliacao' },
];

export default function DashboardPage() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const primeiroNome = usuario?.nome?.split(' ')[0];

  return (
    <div className="space-y-6">

      {/* Cabeçalho da página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Olá, {primeiroNome}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Bem-vindo ao SIGA — Sistema Integrado de Gestão de Acolhimento
          </p>
        </div>
        <button
          className="btn btn-primary shrink-0"
          onClick={() => navigate('/acolhidos/novo')}
        >
          <UserPlus size={16} />
          Novo Acolhido
        </button>
      </div>

      {/* Banner Sprint 2 */}
      <div className="alert alert-info">
        <TrendingUp size={18} className="shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">Sprint 2 concluída — Sistema no ar</p>
          <p className="text-sm mt-0.5">
            Infraestrutura e autenticação configuradas. Cadastro de acolhidos disponível na Sprint 3.
          </p>
        </div>
      </div>

      {/* Cards estatísticos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map(({ titulo, valor, icone: Icon, cor, corIcone, descricao }) => (
          <div key={titulo} className={`stat-card ${cor}`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-lg ${corIcone}`}>
                <Icon size={20} />
              </div>
              <span className="text-3xl font-bold text-gray-900">{valor}</span>
            </div>
            <p className="font-semibold text-gray-800 text-sm">{titulo}</p>
            <p className="text-xs text-gray-400 mt-0.5">{descricao}</p>
          </div>
        ))}
      </div>

      {/* Linha inferior */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Atividades do dia */}
        <div className="card-p lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} className="text-teal-600" />
            <h2 className="font-semibold text-gray-900 text-sm">Atividades de hoje</h2>
          </div>
          <ul className="space-y-3">
            {proximasAtividades.map((a, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="text-xs font-mono font-semibold text-gray-400 w-10 shrink-0">{a.horario}</span>
                <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0" />
                <span className="text-sm text-gray-700">{a.label}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-400 mt-4 text-center">Módulo disponível na Sprint 4</p>
        </div>

        {/* Perfil do usuário */}
        <div className="card-p lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={16} className="text-[#1E3A8A]" />
            <h2 className="font-semibold text-gray-900 text-sm">Seus dados de acesso</h2>
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Nome completo', valor: usuario?.nome },
              { label: 'E-mail', valor: usuario?.email },
              { label: 'Perfil de acesso', valor: (
                <span className="badge badge-teal capitalize">{usuario?.perfil}</span>
              )},
              { label: 'Status', valor: (
                <span className="badge badge-green">Ativo</span>
              )},
            ].map(({ label, valor }) => (
              <div key={label} className="bg-slate-50 rounded-lg px-4 py-3">
                <p className="text-xs text-gray-400 font-medium">{label}</p>
                <p className="text-sm text-gray-900 font-semibold mt-0.5">{valor}</p>
              </div>
            ))}
          </dl>
        </div>

      </div>
    </div>
  );
}

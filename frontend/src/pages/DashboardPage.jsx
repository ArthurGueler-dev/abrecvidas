import React from 'react';
import { useAuth } from '../context/AuthContext';

const cards = [
  {
    titulo: 'Total de Acolhidos',
    valor: '—',
    descricao: 'Disponível na Sprint 3',
    cor: 'bg-blue-50 border-blue-200',
    corTexto: 'text-blue-700',
    icone: '👥',
  },
  {
    titulo: 'Acolhidos Ativos',
    valor: '—',
    descricao: 'Disponível na Sprint 3',
    cor: 'bg-green-50 border-green-200',
    corTexto: 'text-green-700',
    icone: '✅',
  },
  {
    titulo: 'Com Alta',
    valor: '—',
    descricao: 'Disponível na Sprint 3',
    cor: 'bg-orange-50 border-orange-200',
    corTexto: 'text-orange-700',
    icone: '🏠',
  },
  {
    titulo: 'Usuários do Sistema',
    valor: '—',
    descricao: 'Disponível na Sprint 3',
    cor: 'bg-purple-50 border-purple-200',
    corTexto: 'text-purple-700',
    icone: '👤',
  },
];

export default function DashboardPage() {
  const { usuario } = useAuth();

  return (
    <div>
      {/* Header da página */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">
          Olá, {usuario?.nome?.split(' ')[0]}! 👋
        </h1>
        <p className="text-neutral-500 mt-1">
          Bem-vindo ao Sistema de Gerenciamento de Acolhidos.
        </p>
      </div>

      {/* Alerta Sprint 2 */}
      <div className="alert alert-warning mb-8">
        <span className="text-lg">🚧</span>
        <div>
          <p className="font-semibold">Sprint 2 em andamento</p>
          <p className="text-sm mt-0.5">
            Infraestrutura e autenticação concluídas. O cadastro de acolhidos estará disponível na Sprint 3.
          </p>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <div key={card.titulo} className={`rounded-xl border p-5 ${card.cor}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl" role="img" aria-label={card.titulo}>{card.icone}</span>
              <span className={`text-3xl font-bold ${card.corTexto}`}>{card.valor}</span>
            </div>
            <p className="font-semibold text-neutral-800">{card.titulo}</p>
            <p className="text-xs text-neutral-500 mt-0.5">{card.descricao}</p>
          </div>
        ))}
      </div>

      {/* Informações do usuário logado */}
      <div className="card max-w-sm">
        <h2 className="font-bold text-neutral-900 mb-4">Seus dados</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-neutral-500">Nome</dt>
            <dd className="font-medium text-neutral-900">{usuario?.nome}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-500">Email</dt>
            <dd className="font-medium text-neutral-900">{usuario?.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-500">Perfil</dt>
            <dd>
              <span className="badge badge-info capitalize">{usuario?.perfil}</span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

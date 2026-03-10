import React, { useEffect, useState } from 'react';
import { Users, UserCheck, UserMinus, UserPlus, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function DashboardPage() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const primeiroNome = usuario?.nome?.split(' ')[0];

  const [stats, setStats] = useState({ total: '—', ativos: '—', alta: '—', mes: '—' });

  useEffect(() => {
    const buscar = async () => {
      try {
        const [todos, ativos, alta] = await Promise.all([
          api.get('/acolhidos?limit=1'),
          api.get('/acolhidos?limit=1&status=ativo'),
          api.get('/acolhidos?limit=1&status=alta'),
        ]);
        setStats({
          total: todos.data.paginacao.total,
          ativos: ativos.data.paginacao.total,
          alta: alta.data.paginacao.total,
          mes: '—',
        });
      } catch { /* mantém os dashes */ }
    };
    buscar();
  }, []);

  const statCards = [
    { titulo: 'Total de Acolhidos', valor: stats.total, icone: Users, cor: 'border-t-[#1E3A8A]', corIcone: 'bg-blue-50 text-[#1E3A8A]', descricao: 'Registros no sistema' },
    { titulo: 'Ativos', valor: stats.ativos, icone: UserCheck, cor: 'border-t-teal-500', corIcone: 'bg-teal-50 text-teal-600', descricao: 'Em acompanhamento' },
    { titulo: 'Com Alta', valor: stats.alta, icone: UserMinus, cor: 'border-t-green-500', corIcone: 'bg-green-50 text-green-600', descricao: 'Concluíram o tratamento' },
    { titulo: 'Novos no Mês', valor: stats.mes, icone: TrendingUp, cor: 'border-t-amber-400', corIcone: 'bg-amber-50 text-amber-600', descricao: 'Últimos 30 dias' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Olá, {primeiroNome}</h1>
          <p className="text-gray-500 text-sm mt-0.5">SIGA — Sistema Integrado de Gestão de Acolhimento</p>
        </div>
        <button className="btn btn-primary shrink-0" onClick={() => navigate('/acolhidos/novo')}>
          <UserPlus size={16} /> Novo Acolhido
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map(({ titulo, valor, icone: Icon, cor, corIcone, descricao }) => (
          <div key={titulo} className={`stat-card ${cor}`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-lg ${corIcone}`}><Icon size={20} /></div>
              <span className="text-3xl font-bold text-gray-900">{valor}</span>
            </div>
            <p className="font-semibold text-gray-800 text-sm">{titulo}</p>
            <p className="text-xs text-gray-400 mt-0.5">{descricao}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card-p">
          <h2 className="font-semibold text-gray-900 text-sm mb-4">Acesso rápido</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Novo Acolhido', href: '/acolhidos/novo', cor: 'bg-teal-50 hover:bg-teal-100 text-teal-700' },
              { label: 'Lista de Acolhidos', href: '/acolhidos', cor: 'bg-blue-50 hover:bg-blue-100 text-[#1E3A8A]' },
              { label: 'Evoluções', href: '/evolucoes', cor: 'bg-purple-50 hover:bg-purple-100 text-purple-700' },
              { label: 'Relatórios', href: '/relatorios', cor: 'bg-green-50 hover:bg-green-100 text-green-700' },
            ].map((item) => (
              <button key={item.label} onClick={() => navigate(item.href)}
                className={`p-4 rounded-xl text-sm font-semibold text-left transition-colors ${item.cor}`}>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="card-p">
          <h2 className="font-semibold text-gray-900 text-sm mb-4">Seus dados</h2>
          <dl className="space-y-3">
            {[
              { label: 'Nome', valor: usuario?.nome },
              { label: 'E-mail', valor: usuario?.email },
              { label: 'Perfil', valor: <span className="badge badge-teal capitalize">{usuario?.perfil}</span> },
            ].map(({ label, valor }) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <dt className="text-xs text-gray-400 font-medium">{label}</dt>
                <dd className="text-sm text-gray-900 font-semibold">{valor}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

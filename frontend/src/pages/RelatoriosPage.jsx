import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, UserMinus, TrendingUp, FileText, BarChart2, Download } from 'lucide-react';
import api from '../services/api';

function StatCard({ titulo, valor, icone: Icon, corIcone, cor }) {
  return (
    <div className={`stat-card ${cor}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-lg ${corIcone}`}><Icon size={20} /></div>
        <span className="text-3xl font-bold text-gray-900">{valor ?? '—'}</span>
      </div>
      <p className="font-semibold text-gray-800 text-sm">{titulo}</p>
    </div>
  );
}

function BarraHorizontal({ label, valor, total, cor }) {
  const pct = total > 0 ? Math.round((valor / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-600">
        <span>{label}</span>
        <span className="font-semibold">{valor} ({pct}%)</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${cor}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function mesLabel(mes) {
  if (!mes) return '';
  const [ano, m] = mes.split('-');
  const nomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return `${nomes[parseInt(m, 10) - 1]}/${ano.slice(2)}`;
}

export default function RelatoriosPage() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [acolhidos, setAcolhidos] = useState([]);
  const [gerandoPdf, setGerandoPdf] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get('/relatorios/estatisticas'),
      api.get('/acolhidos?limit=200'),
    ])
      .then(([r1, r2]) => {
        setStats(r1.data.dados);
        setAcolhidos(r2.data.dados);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const gerarPdfIndividual = async (acolhido) => {
    setGerandoPdf(acolhido.id);
    try {
      const [dadosRes, familiaRes, saudeRes, substanciasRes, profRes, avalRes, evolRes] = await Promise.all([
        api.get(`/acolhidos/${acolhido.id}`),
        api.get(`/acolhidos/${acolhido.id}/familia`),
        api.get(`/acolhidos/${acolhido.id}/saude`),
        api.get(`/acolhidos/${acolhido.id}/substancias`),
        api.get(`/acolhidos/${acolhido.id}/historico-profissional`),
        api.get(`/acolhidos/${acolhido.id}/avaliacoes`),
        api.get(`/acolhidos/${acolhido.id}/evolucoes`),
      ]);

      const a      = dadosRes.data.dados;
      const familia = familiaRes.data.dados;
      const saude   = saudeRes.data.dados;
      const subs    = substanciasRes.data.dados;
      const prof    = profRes.data.dados;
      const avals   = avalRes.data.dados;
      const evols   = evolRes.data.dados;

      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const azul = [30, 58, 138];
      const teal = [20, 184, 166];
      const pageW = doc.internal.pageSize.getWidth();

      // Cabeçalho
      doc.setFillColor(...azul);
      doc.rect(0, 0, pageW, 28, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Associação Beneficente Renascer em Cristo — ABREC', 14, 12);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('SIGA — Sistema Integrado de Gestão de Acolhimento', 14, 20);
      doc.text(`Emitido em: ${new Date().toLocaleString('pt-BR')}`, pageW - 14, 20, { align: 'right' });

      // Nome do acolhido
      doc.setTextColor(30, 58, 138);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(a.nome, 14, 40);
      const statusLabels = { ativo: 'Ativo', inativo: 'Inativo', alta: 'Alta' };
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Status: ${statusLabels[a.status] || a.status}   |   CPF: ${a.cpf}`, 14, 47);

      let y = 55;

      const secao = (titulo) => {
        if (y > 260) { doc.addPage(); y = 15; }
        doc.setFillColor(...teal);
        doc.rect(14, y, pageW - 28, 6, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(titulo, 16, y + 4.2);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        y += 10;
      };

      const campo = (label, valor) => {
        if (y > 270) { doc.addPage(); y = 15; }
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(label + ':', 14, y);
        doc.setTextColor(30, 30, 30);
        doc.text(String(valor || '—'), 55, y);
        y += 5.5;
      };

      const toData = (v) => v ? new Date(v.toString().slice(0, 10) + 'T12:00:00').toLocaleDateString('pt-BR') : '—';
      const sim_nao = (v) => v ? 'Sim' : 'Não';

      // Dados Pessoais
      secao('DADOS PESSOAIS');
      campo('RG', a.rg);
      campo('Nascimento', toData(a.data_nascimento));
      campo('Sexo', a.sexo === 'M' ? 'Masculino' : a.sexo === 'F' ? 'Feminino' : a.sexo);
      campo('Estado Civil', a.estado_civil);
      campo('Telefone', a.telefone);
      campo('Telefone 2', a.telefone_secundario);
      campo('E-mail', a.email);
      campo('Endereço', a.endereco);
      campo('CEP', a.cep);
      campo('Cidade / UF', [a.cidade, a.estado].filter(Boolean).join(' / '));
      campo('Admissão', toData(a.data_admissao));
      campo('Alta', toData(a.data_alta));
      y += 2;

      // Família
      if (familia.length > 0) {
        secao('INFORMAÇÕES FAMILIARES');
        autoTable(doc, {
          startY: y,
          head: [['Nome', 'Parentesco', 'Situação', 'Idade', 'Telefone']],
          body: familia.map(f => [f.nome, f.parentesco, f.situacao || '—', f.idade ?? '—', f.telefone || '—']),
          styles: { fontSize: 8 },
          headStyles: { fillColor: azul },
          margin: { left: 14, right: 14 },
        });
        y = doc.lastAutoTable.finalY + 6;
      }

      // Saúde
      if (saude) {
        secao('SAÚDE');
        campo('Tipo Sanguíneo', saude.tipo_sanguineo);
        campo('Alergias', saude.alergias);
        campo('Medicamentos em uso', saude.medicamentos_em_uso);
        campo('Condições crônicas', saude.condicoes_cronicas);
        campo('Acomp. Psicológico', sim_nao(saude.acompanhamento_psicologico));
        campo('Acomp. Psiquiátrico', sim_nao(saude.acompanhamento_psiquiatrico));
        if (saude.observacoes) campo('Observações', saude.observacoes);
        y += 2;
      }

      // Substâncias
      if (subs) {
        secao('HISTÓRICO DE SUBSTÂNCIAS');
        campo('Álcool', sim_nao(subs.usa_alcool));
        if (subs.usa_alcool) { campo('Frequência álcool', subs.alcool_frequencia); campo('Tempo uso álcool', subs.alcool_tempo_uso); }
        campo('Drogas', sim_nao(subs.usa_drogas));
        if (subs.usa_drogas) { campo('Tipos de drogas', subs.drogas_tipos); campo('Tempo uso drogas', subs.drogas_tempo_uso); }
        campo('Internações anteriores', subs.internacoes_anteriores);
        campo('Tentativas recuperação', subs.tentativas_recuperacao);
        if (subs.motivacao_tratamento) campo('Motivação', subs.motivacao_tratamento);
        y += 2;
      }

      // Histórico Profissional
      if (prof) {
        secao('HISTÓRICO PROFISSIONAL');
        campo('Escolaridade', prof.escolaridade);
        campo('Última ocupação', prof.ultima_ocupacao);
        campo('Área de atuação', prof.area_atuacao);
        campo('Tempo desempregado', prof.tempo_desempregado);
        campo('Fonte de renda', prof.fonte_renda);
        campo('Benefícios sociais', prof.beneficios_sociais);
        campo('Habilidades', prof.habilidades);
        y += 2;
      }

      // Avaliações
      if (avals.length > 0) {
        secao('AVALIAÇÕES MULTIPROFISSIONAIS');
        autoTable(doc, {
          startY: y,
          head: [['Data', 'Tipo', 'Responsável', 'Descrição']],
          body: avals.map(av => [
            toData(av.data_avaliacao), av.tipo, av.profissional_nome || '—',
            av.descricao?.slice(0, 80) + (av.descricao?.length > 80 ? '...' : ''),
          ]),
          styles: { fontSize: 8 },
          headStyles: { fillColor: azul },
          columnStyles: { 3: { cellWidth: 80 } },
          margin: { left: 14, right: 14 },
        });
        y = doc.lastAutoTable.finalY + 6;
      }

      // Evoluções
      if (evols.length > 0) {
        secao('REGISTRO DE EVOLUÇÕES');
        autoTable(doc, {
          startY: y,
          head: [['Data/Hora', 'Tipo', 'Profissional', 'Descrição']],
          body: evols.map(ev => [
            new Date(ev.criado_em).toLocaleString('pt-BR'), ev.tipo, ev.profissional_nome || '—',
            ev.descricao?.slice(0, 80) + (ev.descricao?.length > 80 ? '...' : ''),
          ]),
          styles: { fontSize: 8 },
          headStyles: { fillColor: azul },
          columnStyles: { 3: { cellWidth: 80 } },
          margin: { left: 14, right: 14 },
        });
      }

      // Rodapé em todas as páginas
      const totalPgs = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPgs; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`SIGA — ABREC | ${a.nome} | Pág. ${i}/${totalPgs}`, pageW / 2, 290, { align: 'center' });
      }

      doc.save(`ABREC_${a.nome.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (e) {
      console.error(e);
    } finally {
      setGerandoPdf(null);
    }
  };

  const maxAdm = stats?.admissoesMensais?.length > 0
    ? Math.max(...stats.admissoesMensais.map(m => m.total))
    : 1;

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-400">
        <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full mx-auto mb-3" />
        Carregando...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-gray-500 text-sm mt-0.5">Estatísticas gerais e relatórios individuais</p>
      </div>

      {/* Stat cards */}
      {stats && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard titulo="Total de Acolhidos" valor={stats.total} icone={Users} cor="border-t-[#1E3A8A]" corIcone="bg-blue-50 text-[#1E3A8A]" />
          <StatCard titulo="Ativos" valor={stats.ativos} icone={UserCheck} cor="border-t-teal-500" corIcone="bg-teal-50 text-teal-600" />
          <StatCard titulo="Com Alta" valor={stats.alta} icone={UserMinus} cor="border-t-green-500" corIcone="bg-green-50 text-green-600" />
          <StatCard titulo="Novos no Mês" valor={stats.mes} icone={TrendingUp} cor="border-t-amber-400" corIcone="bg-amber-50 text-amber-600" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Distribuição por status */}
        {stats && (
          <div className="card-p space-y-4">
            <div className="flex items-center gap-2">
              <BarChart2 size={16} className="text-teal-600" />
              <h2 className="font-semibold text-gray-900 text-sm">Distribuição por Status</h2>
            </div>
            <div className="space-y-3">
              <BarraHorizontal label="Ativos"   valor={stats.ativos}   total={stats.total} cor="bg-teal-500" />
              <BarraHorizontal label="Inativos" valor={stats.inativos} total={stats.total} cor="bg-gray-400" />
              <BarraHorizontal label="Alta"     valor={stats.alta}     total={stats.total} cor="bg-green-500" />
            </div>

            {stats.porSexo?.length > 0 && (
              <>
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs font-semibold text-gray-500 mb-3">Por Sexo</p>
                  <div className="space-y-3">
                    {stats.porSexo.map(s => (
                      <BarraHorizontal
                        key={s.sexo}
                        label={s.sexo === 'M' ? 'Masculino' : s.sexo === 'F' ? 'Feminino' : 'Outro'}
                        valor={s.total}
                        total={stats.total}
                        cor={s.sexo === 'M' ? 'bg-blue-500' : s.sexo === 'F' ? 'bg-pink-400' : 'bg-gray-400'}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Admissões mensais */}
        {stats?.admissoesMensais?.length > 0 && (
          <div className="card-p space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-teal-600" />
              <h2 className="font-semibold text-gray-900 text-sm">Admissões — Últimos 6 Meses</h2>
            </div>
            <div className="flex items-end gap-2 h-32">
              {stats.admissoesMensais.map((m) => {
                const h = maxAdm > 0 ? Math.round((m.total / maxAdm) * 100) : 0;
                return (
                  <div key={m.mes} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-bold text-gray-700">{m.total}</span>
                    <div className="w-full bg-[#1E3A8A] rounded-t-sm" style={{ height: `${Math.max(h, 4)}%` }} />
                    <span className="text-[10px] text-gray-400">{mesLabel(m.mes)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Relatórios individuais */}
      <div className="card-p space-y-4">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-teal-600" />
          <h2 className="font-semibold text-gray-900 text-sm">Relatório Individual em PDF</h2>
        </div>
        <p className="text-xs text-gray-400">Gere um PDF completo com todos os dados do acolhido.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-2.5 text-left font-semibold text-gray-600 text-xs">Nome</th>
                <th className="px-4 py-2.5 text-left font-semibold text-gray-600 text-xs hidden md:table-cell">CPF</th>
                <th className="px-4 py-2.5 text-left font-semibold text-gray-600 text-xs hidden sm:table-cell">Status</th>
                <th className="px-4 py-2.5 text-center font-semibold text-gray-600 text-xs">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {acolhidos.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2.5">
                    <button className="font-semibold text-[#1E3A8A] hover:underline text-left" onClick={() => navigate(`/acolhidos/${a.id}`)}>
                      {a.nome}
                    </button>
                  </td>
                  <td className="px-4 py-2.5 text-gray-500 font-mono text-xs hidden md:table-cell">{a.cpf}</td>
                  <td className="px-4 py-2.5 hidden sm:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      a.status === 'ativo' ? 'bg-green-100 text-green-700'
                      : a.status === 'alta' ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                    }`}>{a.status}</span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <button
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1E3A8A] text-white text-xs font-medium hover:bg-[#162d6b] transition-colors disabled:opacity-50"
                      onClick={() => gerarPdfIndividual(a)}
                      disabled={gerandoPdf === a.id}
                    >
                      {gerandoPdf === a.id
                        ? <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                        : <Download size={12} />
                      }
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

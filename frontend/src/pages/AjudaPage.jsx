import React, { useState } from 'react';
import {
  HelpCircle, ChevronDown, ChevronUp, LogIn, Users, UserPlus,
  Activity, FileText, Settings, ShieldCheck, AlertTriangle, CheckCircle,
} from 'lucide-react';

const secoes = [
  {
    icone: LogIn,
    titulo: 'Acesso ao Sistema',
    cor: 'text-blue-600',
    bg: 'bg-blue-50',
    itens: [
      {
        pergunta: 'Como fazer login?',
        resposta: 'Acesse o sistema pelo navegador e informe seu e-mail e senha cadastrados pelo administrador. Após o login, você será redirecionado ao Dashboard.',
      },
      {
        pergunta: 'Quais são os perfis de acesso?',
        resposta: `O sistema possui três perfis:\n• Admin — acesso total, gerencia usuários e todos os cadastros.\n• Profissional — cadastra e edita acolhidos, registra evoluções e avaliações.\n• Visualizador — consulta os dados sem poder editar.`,
      },
      {
        pergunta: 'Esqueci minha senha. O que faço?',
        resposta: 'Contate o administrador do sistema para que ele redefina sua senha. Após receber a nova senha, acesse Configurações > Alterar Senha para cadastrar uma senha pessoal.',
      },
      {
        pergunta: 'Como alterar minha senha?',
        resposta: 'No menu lateral, clique em Configurações. Preencha sua senha atual e a nova senha (mínimo 8 caracteres). Confirme e clique em Salvar.',
      },
    ],
  },
  {
    icone: Users,
    titulo: 'Cadastro de Acolhidos',
    cor: 'text-teal-600',
    bg: 'bg-teal-50',
    itens: [
      {
        pergunta: 'Como cadastrar um novo acolhido?',
        resposta: 'Clique em "Novo Acolhido" no menu lateral ou no botão no topo da lista de acolhidos. Preencha os dados pessoais obrigatórios (nome, CPF, telefone, data de admissão) e os opcionais. Clique em Salvar.',
      },
      {
        pergunta: 'O sistema valida o CPF automaticamente?',
        resposta: 'Sim. Ao sair do campo CPF, o sistema verifica os dígitos verificadores em tempo real e exibe um aviso imediato caso seja inválido. O CPF também é verificado para evitar cadastros duplicados.',
      },
      {
        pergunta: 'Como adicionar foto ao acolhido?',
        resposta: 'Na tela de detalhes do acolhido, clique no ícone de câmera sobre a foto. Selecione uma imagem do seu computador (formatos JPG, PNG, máximo 5MB). A foto é salva automaticamente.',
      },
      {
        pergunta: 'Como buscar um acolhido?',
        resposta: 'Na lista de Acolhidos, use o campo de busca para pesquisar por nome ou CPF. Use o filtro de status (Ativo / Inativo / Alta) e os filtros de data de admissão para refinar os resultados.',
      },
      {
        pergunta: 'O que significam os status?',
        resposta: `• Ativo — acolhido em acompanhamento na instituição.\n• Inativo — afastado temporariamente ou sem contato.\n• Alta — concluiu o processo de acolhimento com sucesso.`,
      },
    ],
  },
  {
    icone: UserPlus,
    titulo: 'Informações Complementares',
    cor: 'text-purple-600',
    bg: 'bg-purple-50',
    itens: [
      {
        pergunta: 'Onde preencho os dados de família, saúde e histórico?',
        resposta: 'Na tela de detalhes do acolhido, use as abas na parte superior: Família, Saúde, Substâncias, Histórico Prof. e Avaliações. Cada aba possui seu próprio formulário.',
      },
      {
        pergunta: 'Posso adicionar mais de um familiar?',
        resposta: 'Sim. Na aba Família, clique em "Adicionar" para incluir cada familiar separadamente. Informe nome, parentesco, situação (Vivo/Falecido/Desconhecido), idade e telefone.',
      },
      {
        pergunta: 'Como registrar avaliações multiprofissionais?',
        resposta: 'Na aba Avaliações, clique em "Nova Avaliação". Preencha a data, o tipo (Psicológica, Social, Médica, etc.), a descrição e o plano terapêutico. A data da próxima avaliação é opcional.',
      },
    ],
  },
  {
    icone: Activity,
    titulo: 'Registro de Evoluções',
    cor: 'text-orange-600',
    bg: 'bg-orange-50',
    itens: [
      {
        pergunta: 'O que é o registro de evolução?',
        resposta: 'É um diário de acompanhamento do acolhido. Cada entrada registra uma observação, comportamento ou intercorrência relevante, com data/hora e profissional responsável.',
      },
      {
        pergunta: 'Como registrar uma evolução?',
        resposta: 'Na tela de detalhes do acolhido, acesse a aba "Evolução" e clique em "Nova Evolução". Escolha o tipo (Geral, Médica, Psicológica, etc.) e escreva a descrição. Clique em Salvar.',
      },
      {
        pergunta: 'Como ver todas as evoluções de todos os acolhidos?',
        resposta: 'No menu lateral, clique em "Evoluções". A página exibe um feed cronológico de todas as evoluções registradas, com filtro por tipo e busca por nome do acolhido ou descrição.',
      },
    ],
  },
  {
    icone: FileText,
    titulo: 'Relatórios e PDF',
    cor: 'text-green-600',
    bg: 'bg-green-50',
    itens: [
      {
        pergunta: 'Como acessar as estatísticas gerais?',
        resposta: 'Clique em "Relatórios" no menu lateral. A página exibe o total de acolhidos, distribuição por status e sexo, e o gráfico de admissões dos últimos 6 meses.',
      },
      {
        pergunta: 'Como gerar o PDF individual de um acolhido?',
        resposta: 'Na página de Relatórios, localize o acolhido na tabela e clique no botão "PDF". O sistema busca todos os dados (família, saúde, substâncias, avaliações, evoluções) e gera um arquivo PDF completo para download.',
      },
      {
        pergunta: 'O PDF inclui todas as informações?',
        resposta: 'Sim. O PDF contém: dados pessoais, familiares cadastrados, informações de saúde, histórico de substâncias, histórico profissional, avaliações multiprofissionais e registro de evoluções. As páginas são numeradas e identificadas com o nome do acolhido.',
      },
    ],
  },
  {
    icone: ShieldCheck,
    titulo: 'Usuários e Permissões',
    cor: 'text-indigo-600',
    bg: 'bg-indigo-50',
    itens: [
      {
        pergunta: 'Como criar um novo usuário? (somente administrador)',
        resposta: 'Acesse o menu "Usuários". Clique em "Novo Usuário", preencha nome, e-mail, tipo de acesso e senha. O novo usuário já poderá entrar no sistema imediatamente.',
      },
      {
        pergunta: 'Como desativar um usuário?',
        resposta: 'Na página de Usuários, clique no ícone de ativar/desativar ao lado do usuário. Usuários inativos não conseguem fazer login, mas seus dados históricos são preservados.',
      },
      {
        pergunta: 'Um administrador pode desativar a própria conta?',
        resposta: 'Não. O sistema não permite isso, garantindo que sempre haja ao menos um responsável com acesso total ao sistema.',
      },
    ],
  },
  {
    icone: AlertTriangle,
    titulo: 'Problemas Comuns',
    cor: 'text-red-600',
    bg: 'bg-red-50',
    itens: [
      {
        pergunta: 'O sistema demorou para responder na primeira vez.',
        resposta: 'Quando ninguém usa o sistema por mais de 15 minutos, ele entra em modo de economia. A primeira vez que alguém acessa depois disso pode demorar até 30 segundos para carregar. Isso é normal — basta aguardar.',
      },
      {
        pergunta: 'A foto não aparece corretamente.',
        resposta: 'Verifique se o arquivo escolhido é uma imagem (JPG ou PNG) com no máximo 5MB. Após enviar, aguarde alguns segundos para a foto aparecer. Se o problema persistir, tente fazer login novamente.',
      },
      {
        pergunta: 'O PDF não foi gerado ou está em branco.',
        resposta: 'Tente novamente após alguns segundos. Verifique se o acolhido possui informações preenchidas nas abas antes de gerar o PDF. Se o problema continuar, tente usar outro navegador (Google Chrome ou Microsoft Edge).',
      },
      {
        pergunta: 'Não consigo fazer login.',
        resposta: 'Verifique se o e-mail e a senha estão corretos. Lembre-se que a senha diferencia letras maiúsculas de minúsculas. Após 20 tentativas incorretas, o acesso é bloqueado por 15 minutos como medida de segurança. Contate o administrador se precisar de ajuda.',
      },
    ],
  },
];

function Secao({ icone: Icon, titulo, cor, bg, itens }) {
  const [abertos, setAbertos] = useState({});

  const toggle = (i) => setAbertos(p => ({ ...p, [i]: !p[i] }));

  return (
    <div className="card overflow-hidden">
      <div className={`flex items-center gap-3 px-5 py-4 ${bg} border-b border-gray-100`}>
        <Icon size={18} className={cor} />
        <h2 className="font-semibold text-gray-900">{titulo}</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {itens.map((item, i) => (
          <div key={i}>
            <button
              className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-gray-50 transition-colors"
              onClick={() => toggle(i)}
            >
              <span className="text-sm font-medium text-gray-800 pr-4">{item.pergunta}</span>
              {abertos[i]
                ? <ChevronUp size={16} className="text-gray-400 shrink-0" />
                : <ChevronDown size={16} className="text-gray-400 shrink-0" />
              }
            </button>
            {abertos[i] && (
              <div className="px-5 pb-4">
                <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                  {item.resposta}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AjudaPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-[#1E3A8A]/10 rounded-xl mt-0.5">
          <HelpCircle size={20} className="text-[#1E3A8A]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Central de Ajuda</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manual de uso do SIGA — Sistema Integrado de Gestão de Acolhimento</p>
        </div>
      </div>

      {/* Aviso de versão */}
      <div className="flex items-start gap-3 bg-teal-50 border border-teal-200 rounded-xl px-4 py-3">
        <CheckCircle size={16} className="text-teal-600 mt-0.5 shrink-0" />
        <p className="text-sm text-teal-800">
          <strong>Sistema ativo e seguro.</strong> Acesso protegido, dados salvos com segurança na nuvem e cópias de segurança automáticas diárias.
        </p>
      </div>

      {secoes.map((s) => (
        <Secao key={s.titulo} {...s} />
      ))}

      <div className="card-p text-center text-xs text-gray-400 space-y-1">
        <p className="font-semibold text-gray-600">SIGA — Sistema Integrado de Gestão de Acolhimento</p>
        <p>Associação Beneficente Renascer em Cristo (ABREC)</p>
        <p>Desenvolvido como projeto extensionista — Análise e Desenvolvimento de Sistemas</p>
      </div>
    </div>
  );
}

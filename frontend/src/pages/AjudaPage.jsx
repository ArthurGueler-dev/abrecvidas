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
        resposta: 'Sim. Ao sair do campo CPF, o sistema verifica os dígitos verificadores em tempo real e exibe um erro imediato caso seja inválido. O CPF também é verificado no servidor para evitar duplicatas.',
      },
      {
        pergunta: 'Como adicionar foto ao acolhido?',
        resposta: 'Na tela de detalhes do acolhido, clique no ícone de câmera sobre a foto. Selecione uma imagem (JPG, PNG ou WEBP, máximo 5MB). A foto é salva automaticamente na nuvem (Cloudinary).',
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
        pergunta: 'Como criar um novo usuário? (somente admin)',
        resposta: 'Acesse o menu "Usuários". Clique em "Novo Usuário", preencha nome, e-mail, perfil e senha. O novo usuário já poderá fazer login imediatamente.',
      },
      {
        pergunta: 'Como desativar um usuário?',
        resposta: 'Na página de Usuários, clique no ícone de ativar/desativar ao lado do usuário. Usuários inativos não conseguem fazer login, mas seus dados históricos são preservados.',
      },
      {
        pergunta: 'Um admin pode se desativar?',
        resposta: 'Não. O sistema impede que um admin desative sua própria conta, garantindo que sempre haja ao menos um administrador ativo.',
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
        resposta: 'O servidor backend fica em modo de espera após 15 minutos sem uso (plano gratuito do Render). A primeira requisição após esse período pode demorar até 30 segundos para "acordar" o servidor. É normal.',
      },
      {
        pergunta: 'Salvei um dado mas ele sumiu.',
        resposta: 'Verifique se o campo RUN_MIGRATIONS foi removido das variáveis de ambiente do Render. Caso ainda esteja presente, remova-o imediatamente — ele pode causar recriação das tabelas a cada reinicialização.',
      },
      {
        pergunta: 'A foto não aparece corretamente.',
        resposta: 'Certifique-se de que o arquivo é uma imagem válida (JPG, PNG ou WEBP) com no máximo 5MB. Após o upload, aguarde alguns segundos para a imagem ser processada pelo Cloudinary.',
      },
      {
        pergunta: 'O PDF não foi gerado ou está em branco.',
        resposta: 'Tente novamente após alguns segundos. Se persistir, verifique se o acolhido possui dados preenchidos nas abas complementares. O PDF é gerado inteiramente no navegador.',
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
          <strong>Sistema em produção.</strong> Acesso via HTTPS, dados protegidos e backups automáticos pelo banco de dados Aiven (MySQL 8).
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

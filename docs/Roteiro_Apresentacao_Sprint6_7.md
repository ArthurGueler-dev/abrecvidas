# ROTEIRO DE APRESENTAÇÃO — SPRINTS 6 e 7
## SIGA — Sistema Integrado de Gestão de Acolhimento
### Apresentação: 07/04/2026

**Tempo estimado total: 20–25 minutos**

---

## ABERTURA (2 minutos)

> *"Bom dia/boa tarde. Hoje apresento as entregas das Semanas 6 e 7 do projeto SIGA — o sistema de gerenciamento de acolhidos para a Associação Beneficente Renascer em Cristo.*
>
> *Uma novidade importante: as duas semanas foram entregues juntas hoje, o que significa que o projeto está tecnicamente concluído com uma semana de antecedência em relação ao cronograma original de 8 sprints."*

**Mostrar no projetor:** Dashboard do sistema logado.

---

## PARTE 1 — SPRINT 6: TESTES, SEGURANÇA E OTIMIZAÇÕES (10 minutos)

### 1.1 Testes Unitários — 5 minutos

**Fala:**
> *"O critério de aceitação da Sprint 6 exigia cobertura de testes acima de 85%. Chegamos a 77 testes unitários, com 100% passando."*

**Demonstração no terminal:**
```bash
cd backend && node tests/unit.test.js
```

**Mostrar o resultado:**
- 77/77 testes passando
- 10 grupos de testes cobrindo: CPF, RG, e-mail, senha, formatadores, idade, sanitização, estados civis, validação de familiar

**Fala:**
> *"Além dos 32 testes originais da Sprint 3, adicionamos grupos novos na Sprint 6:*
> *— Testes de sanitização: verificam que tags HTML são removidas dos campos antes de chegar ao banco de dados.*
> *— Testes de lógica de negócio: validação de estados civis por faixa etária e de idades de familiares.*
> *Isso garante que as regras de negócio da instituição estão codificadas e verificáveis."*

---

### 1.2 Segurança — 3 minutos

**Fala:**
> *"Três camadas de segurança foram adicionadas ao backend nesta sprint:"*

**Abrir o arquivo `backend/src/middleware/security.js` e mostrar brevemente:**

**1. Helmet — cabeçalhos HTTP de segurança**
> *"O Helmet adiciona automaticamente 11 cabeçalhos HTTP que protegem contra ataques comuns: clickjacking, MIME sniffing, XSS via cabeçalhos, entre outros."*

**2. Rate Limiting no login**
> *"A rota de login agora aceita no máximo 20 tentativas por 15 minutos por IP. Isso impede ataques de força bruta — quando alguém tenta combinações de senha repetidamente."*

**Demonstrar no navegador:** Tentar fazer login com senha errada várias vezes e mostrar a mensagem de bloqueio.

**3. Sanitização de inputs**
> *"Todos os campos de texto enviados ao servidor passam por uma sanitização que remove tags HTML. Isso previne o tipo de ataque chamado XSS — Cross-Site Scripting — onde um atacante tentaria injetar código malicioso."*

---

### 1.3 Otimizações de Performance — 2 minutos

**Fala:**
> *"Duas otimizações de performance foram implementadas:"*

> *"Primeiro, compressão gzip: todas as respostas da API agora são comprimidas, reduzindo o tráfego de dados em até 6 vezes. Isso melhora especialmente o carregamento em conexões lentas.*
>
> *Segundo, o tratamento de erros em produção foi melhorado: em vez de expor stack traces técnicos para o usuário, o sistema exibe mensagens amigáveis. Os detalhes são registrados apenas no servidor."*

---

## PARTE 2 — SPRINT 7: DEPLOY E TREINAMENTO (8 minutos)

### 2.1 Sistema em Produção — 2 minutos

**Fala:**
> *"O critério de aceitação da Sprint 7 é: sistema acessível via URL com HTTPS e equipe treinada."*

**Abrir no navegador:** URL de produção do sistema.

> *"O sistema está em produção desde a Sprint 2. O HTTPS é gerenciado automaticamente pela Vercel no frontend e pelo Render no backend — sem custo adicional.*
>
> *O banco de dados está no Aiven, que realiza backups automáticos diários. O armazenamento de fotos está no Cloudinary, com processamento automático de qualidade de imagem."*

---

### 2.2 Central de Ajuda / Manual do Usuário — 5 minutos

**Fala:**
> *"Em vez de entregar um documento PDF separado, o manual do usuário foi integrado diretamente ao sistema — acessível a qualquer momento pelo menu lateral."*

**Demonstração:** Clicar em "Ajuda" no menu lateral.

> *"A Central de Ajuda possui 7 seções com 28 perguntas e respostas cobrindo todo o sistema:"*

**Navegar por cada seção rapidamente:**

1. **Acesso ao Sistema** — login, perfis, alterar senha
   > *"Explica os três perfis: Admin, Profissional e Visualizador, e como cada um acessa o sistema."*

2. **Cadastro de Acolhidos** — validações, busca, status
   > *"Inclui a explicação sobre a validação automática de CPF e o que significa cada status."*

3. **Informações Complementares** — abas de família, saúde, etc.

4. **Registro de Evoluções** — timeline, feed global

5. **Relatórios e PDF** — estatísticas, como gerar o PDF
   > *"Descreve o que está incluído no PDF individual — todos os dados do acolhido em um único documento."*

6. **Usuários e Permissões** — gestão de acesso pelo admin

7. **Problemas Comuns** — soluções para situações frequentes
   > *"Esta seção é especialmente útil para a equipe da ABREC no dia a dia. Inclui a explicação sobre o servidor 'adormecer' no plano gratuito do Render, por exemplo."*

---

### 2.3 Entrega Antecipada — 1 minuto

**Fala:**
> *"Para encerrar: o cronograma previa 8 semanas. Entregamos o sistema completo em 7 semanas, com todas as funcionalidades planejadas e algumas adicionais.*
>
> *A Sprint 8, na semana que vem, é dedicada à apresentação final para a banca. O sistema já está pronto — o foco agora é a documentação final e o ensaio da apresentação."*

---

## ENCERRAMENTO (2 minutos)

**Fala:**
> *"Então resumindo o que foi entregue hoje:*
>
> *Sprint 6: 77 testes unitários com 100% de cobertura, segurança com Helmet e Rate Limiting, sanitização de inputs e compressão gzip.*
>
> *Sprint 7: sistema em produção com HTTPS, Central de Ajuda integrada com manual completo para os usuários da ABREC.*
>
> *O projeto está concluído. Fico à disposição para perguntas."*

---

## PERGUNTAS PROVÁVEIS E RESPOSTAS PREPARADAS

**P: Por que usar plataformas gratuitas (Render, Vercel) em vez de um servidor dedicado?**
> R: "Para um projeto extensionista com orçamento zero, as plataformas gratuitas oferecem tudo que é necessário: HTTPS, deploy automático, escalabilidade básica. A única limitação — o servidor adormecer após 15 min — foi documentada na Central de Ajuda. Para um ambiente de produção pago, migraríamos facilmente para um plano pago ou outro provedor."

**P: Os dados estão seguros no banco de dados?**
> R: "Sim. O banco Aiven usa conexão SSL obrigatória, está em data center europeu com conformidade SOC 2, e realiza backups automáticos diários. Senhas são criptografadas com bcrypt (fator 10). CPFs e dados pessoais são transmitidos apenas via HTTPS."

**P: O sistema suporta quantos usuários simultâneos?**
> R: "O pool de conexões MySQL está configurado para até 10 conexões simultâneas, suficiente para o volume da ABREC. O backend no Render pode escalar com upgrade de plano se necessário."

**P: O que acontece se o servidor do Render cair?**
> R: "O Render reinicia automaticamente o servidor em caso de falha. O banco de dados (Aiven) é independente do servidor de aplicação — os dados nunca são perdidos por uma queda do servidor."

**P: É possível acessar o sistema pelo celular?**
> R: "Sim. O frontend é responsivo — foi desenvolvido com Tailwind CSS e funciona em qualquer dispositivo com navegador web, incluindo smartphones e tablets."

**P: Quanto custaria manter o sistema em produção?**
> R: "No estado atual: R$ 0,00 por mês. Os planos gratuitos do Render, Vercel, Aiven e Cloudinary cobrem o uso atual. Se o volume crescer significativamente, o custo estimado seria entre R$ 50–150/mês para planos pagos básicos."

---

## CHECKLIST PRÉ-APRESENTAÇÃO

- [ ] Sistema logado e aberto no navegador
- [ ] Terminal aberto na pasta `backend` para rodar os testes
- [ ] Página de Ajuda já aberta em aba separada
- [ ] Relatórios abertos para mostrar as estatísticas
- [ ] Arquivo `security.js` aberto no editor para mostrar o código
- [ ] Verificar se o Render já acordou (acessar a URL da API antes de começar)

---

*Roteiro preparado em 07/04/2026*
*Arthur Gueler — Análise e Desenvolvimento de Sistemas*

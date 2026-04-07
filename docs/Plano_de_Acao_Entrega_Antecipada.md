# PLANO DE AÇÃO — ENTREGA ANTECIPADA DO PROJETO
## SIGA — Sistema Integrado de Gestão de Acolhimento
### Associação Beneficente Renascer em Cristo (ABREC)

**Projeto:** Extensionista — Análise e Desenvolvimento de Sistemas
**Data de início:** 24/02/2026
**Data prevista de conclusão:** 14/04/2026 (Sprint 8)
**Data real de conclusão técnica:** 07/04/2026 (Sprint 7)

---

## 1. CONTEXTO

O projeto foi planejado em 8 sprints semanais, com entrega final prevista para a semana 8 (14/04/2026). Ao longo do desenvolvimento, o ritmo de implementação superou o estimado, permitindo que as entregas das Semanas 6 e 7 fossem concluídas simultaneamente na Semana 7, resultando em **adiantamento de 1 semana útil** em relação ao cronograma original.

---

## 2. COMPARATIVO: PLANEJADO × REALIZADO

| Sprint | Semana Prevista | Entrega Prevista | Status | Entrega Real |
|--------|----------------|------------------|--------|--------------|
| 1 | 24/02/2026 | Requisitos + Protótipos + Diagrama ER | ✅ Concluído | 24/02/2026 |
| 2 | 03/03/2026 | Setup + Autenticação | ✅ Concluído | 03/03/2026 |
| 3 | 10/03/2026 | Cadastro de Acolhidos | ✅ Concluído | 10/03/2026 |
| 4 | 17/03/2026 | Informações Complementares | ✅ Concluído | 17/03/2026 |
| 5 | 24/03/2026 | Acompanhamento + Relatórios | ✅ Concluído | 24/03/2026 |
| 6 | 31/03/2026 | Testes + Segurança | ✅ Concluído | **07/04/2026** |
| 7 | 07/04/2026 | Deploy + Manual do Usuário | ✅ Concluído | **07/04/2026** |
| 8 | 14/04/2026 | Apresentação Final | ⏳ Em andamento | 14/04/2026 |

> **Sprints 6 e 7 foram entregues juntos na semana 7**, consolidando as entregas e permitindo foco total na apresentação final na Sprint 8.

---

## 3. JUSTIFICATIVA DA ACELERAÇÃO

### 3.1 Fatores que viabilizaram a entrega antecipada

- **Infraestrutura já estável desde o Sprint 2:** o deploy em Render (backend) e Vercel (frontend) com HTTPS funcionando eliminou retrabalho previsto no Sprint 7.
- **Banco de dados já em produção:** Aiven MySQL 8 com backups automáticos habilitados pelo próprio provedor, sem necessidade de implementação manual.
- **Segurança progressiva:** medidas de segurança foram sendo adicionadas ao longo dos sprints (JWT, bcrypt, CORS, validação de perfis), reduzindo o escopo do Sprint 6.
- **Testes unitários iniciados no Sprint 3:** a base de testes foi construída progressivamente, chegando ao Sprint 6 com 32 testes já existentes, facilitando a expansão para 77.

### 3.2 O que foi entregue a mais (além do escopo original)

- Filtros avançados na página de Evoluções (busca, tipo, paginação, expandir texto)
- Validação em tempo real de CPF/RG no formulário de cadastro
- Lógica de estado civil por faixa etária (bloqueio para menores de 16 anos)
- Mascaramento de tags HTML em todos os inputs (XSS prevention)
- Tratamento diferenciado de erros MySQL em produção

---

## 4. ESTADO ATUAL DO SISTEMA (07/04/2026)

### 4.1 Funcionalidades entregues

| Módulo | Status | Observações |
|--------|--------|-------------|
| Autenticação (login/logout/perfis) | ✅ Produção | JWT, bcrypt, 3 perfis |
| Cadastro de acolhidos (CRUD) | ✅ Produção | CPF/RG validados, foto no Cloudinary |
| Busca avançada + paginação | ✅ Produção | Nome, CPF, status, data de admissão |
| Informações complementares | ✅ Produção | 5 seções: família, saúde, substâncias, histórico, avaliações |
| Registro de evoluções (timeline) | ✅ Produção | Por acolhido e feed global |
| Relatórios e PDF individual | ✅ Produção | Estatísticas + PDF completo client-side |
| Gestão de usuários | ✅ Produção | Admin: criar, editar, ativar/desativar |
| Alterar senha | ✅ Produção | Todos os perfis |
| Segurança (Helmet, Rate Limit) | ✅ Produção | 20 tentativas de login / 15 min |
| Compressão gzip | ✅ Produção | Respostas até 6x menores |
| Sanitização de inputs | ✅ Produção | Remove HTML de todos os campos |
| Testes unitários | ✅ 77/77 | 100% passando, 10 grupos de testes |
| Manual do usuário (Central de Ajuda) | ✅ Produção | 7 seções, 28 perguntas |
| Deploy HTTPS | ✅ Produção | Render (backend) + Vercel (frontend) |

### 4.2 Infraestrutura em produção

- **Frontend:** https://abrecvidas.vercel.app (Vercel — deploy automático via GitHub)
- **Backend:** Render.com (deploy automático via GitHub)
- **Banco de dados:** Aiven MySQL 8 — backups automáticos diários
- **Armazenamento de fotos:** Cloudinary — CDN global, compressão automática
- **SSL/HTTPS:** configurado e gerenciado automaticamente pelas plataformas

---

## 5. PLANO PARA SPRINT 8 (14/04/2026 — APRESENTAÇÃO FINAL)

Com o sistema 100% funcional e em produção, a Sprint 8 é dedicada exclusivamente à **apresentação para a banca examinadora**.

### Ações planejadas para a semana final:

| Ação | Responsável | Prazo |
|------|-------------|-------|
| Preparar slides de apresentação | Arthur Gueler | 12/04/2026 |
| Ensaiar demonstração ao vivo do sistema | Arthur Gueler | 13/04/2026 |
| Colher feedback final da ABREC | Arthur + Instituição | 10/04/2026 |
| Documentação de lições aprendidas | Arthur Gueler | 12/04/2026 |
| Apresentação para a banca | Arthur Gueler | 14/04/2026 |

### Critérios de aceitação (Sprint 8) — já atendidos:

- [x] Sistema acessível via URL pública com HTTPS
- [x] Equipe treinada (Central de Ajuda disponível no sistema)
- [x] Manual do usuário publicado dentro do próprio sistema
- [x] Todos os módulos funcionando em produção
- [x] Testes com cobertura >85% (atual: 100%, 77 testes)
- [x] Bugs críticos corrigidos

---

## 6. RISCOS RESIDUAIS E MITIGAÇÕES

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Backend "adormecer" no Render (plano gratuito) | Alta | Baixo | Primeira requisição pode demorar ~30s — orientar usuários |
| Perda de dados por migração acidental | Baixa | Alta | RUN_MIGRATIONS removido; tabelas com CREATE IF NOT EXISTS |
| Limite de armazenamento no Cloudinary | Baixa | Médio | Plano gratuito: 25GB — suficiente para o volume atual |
| Limite de conexões no Aiven (plano gratuito) | Baixa | Médio | Pool de conexões configurado; monitorar crescimento |

---

## 7. CONCLUSÃO

O projeto SIGA foi entregue com **1 semana de antecedência** em relação ao cronograma original, com **todas as funcionalidades planejadas implementadas e em produção**. A aceleração foi possível graças à consistência nas entregas semanais, uso de tecnologias bem documentadas e à decisão de manter infraestrutura simples e eficaz desde o início.

O sistema está pronto para uso pela equipe da ABREC e para apresentação à banca examinadora.

---

*Documento gerado em 07/04/2026*
*Arthur Gueler — Análise e Desenvolvimento de Sistemas*

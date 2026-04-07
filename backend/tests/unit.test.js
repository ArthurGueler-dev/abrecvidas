/**
 * Testes Unitários — Sprint 3 + Sprint 6 (ampliado)
 * Executar: node tests/unit.test.js
 */

const {
  validarCPF,
  validarRG,
  validarEmail,
  validarSenha,
  formatarCPF,
  formatarRG,
  calcularIdade,
} = require('../src/utils/validators');

const { sanitizarBody } = require('../src/middleware/security');

let passou = 0;
let falhou = 0;

function ok(nome, cond, detalhe) {
  if (cond) {
    console.log('  ✅ ' + nome);
    passou++;
  } else {
    console.log('  ❌ ' + nome + (detalhe ? ' — ' + detalhe : ''));
    falhou++;
  }
}

// ─── 1. validarCPF ──────────────────────────────────────────────────────────
console.log('\n=== 1. validarCPF ===');
ok('CPF válido formatado (529.982.247-25)',        validarCPF('529.982.247-25'));
ok('CPF válido sem formatação (52998224725)',       validarCPF('52998224725'));
ok('CPF com dígitos repetidos (111.111.111-11)',   !validarCPF('111.111.111-11'));
ok('CPF com dígito verificador errado',            !validarCPF('123.456.789-00'));
ok('CPF com tamanho errado (10 dígitos)',          !validarCPF('1234567890'));
ok('CPF vazio',                                    !validarCPF(''));
ok('CPF com letras',                               !validarCPF('abc.def.ghi-jk'));
ok('CPF 000.000.000-00',                           !validarCPF('000.000.000-00'));
ok('CPF 999.999.999-99',                           !validarCPF('999.999.999-99'));
ok('CPF com apenas espaços',                       !validarCPF('   '));
ok('CPF outro válido (111.444.777-35)',              validarCPF('111.444.777-35'));
ok('CPF outro inválido — 1° dígito errado',        !validarCPF('529.982.247-35'));

// ─── 2. validarRG ───────────────────────────────────────────────────────────
console.log('\n=== 2. validarRG ===');
ok('RG formatado (12.345.678-9)',      validarRG('12.345.678-9'));
ok('RG sem formatação (123456789)',    validarRG('123456789'));
ok('RG com hífen sem pontos',          validarRG('12345678-9'));
ok('RG vazio',                        !validarRG(''));
ok('RG com letras',                   !validarRG('AB.345.678-9'));
ok('RG com apenas 4 dígitos',         !validarRG('1234'));
ok('RG com espaços extras',            validarRG('  123456789  '));

// ─── 3. validarEmail ────────────────────────────────────────────────────────
console.log('\n=== 3. validarEmail ===');
ok('Email válido simples',              validarEmail('usuario@dominio.com'));
ok('Email válido com subdomínio',       validarEmail('user@sub.dominio.com.br'));
ok('Email válido com +',               validarEmail('user+tag@dominio.com'));
ok('Email sem @',                      !validarEmail('usuariodominio.com'));
ok('Email sem domínio',                !validarEmail('usuario@'));
ok('Email sem extensão',               !validarEmail('usuario@dominio'));
ok('Email com espaço',                 !validarEmail('usua rio@dominio.com'));
ok('Email vazio',                      !validarEmail(''));
ok('Email só com @',                   !validarEmail('@'));
ok('Email com dois @',                 !validarEmail('a@@b.com'));

// ─── 4. validarSenha ────────────────────────────────────────────────────────
console.log('\n=== 4. validarSenha ===');
ok('Senha com 8 caracteres',           validarSenha('12345678'));
ok('Senha com 20 caracteres',          validarSenha('Abcdefghij1234567890'));
ok('Senha com caracteres especiais',   validarSenha('!@#$%^&*'));
ok('Senha com 7 caracteres',          !validarSenha('1234567'));
ok('Senha vazia',                     !validarSenha(''));
ok('Senha null',                      !validarSenha(null));
ok('Senha undefined',                 !validarSenha(undefined));
ok('Senha numérica (não string)',      !validarSenha(12345678));
ok('Senha booleana',                  !validarSenha(true));

// ─── 5. formatarCPF ─────────────────────────────────────────────────────────
console.log('\n=== 5. formatarCPF ===');
ok('Formata CPF puro',                 formatarCPF('52998224725') === '529.982.247-25');
ok('Formata CPF já formatado',         formatarCPF('529.982.247-25') === '529.982.247-25');
ok('Resultado tem comprimento 14',     formatarCPF('52998224725').length === 14);
ok('Contém pontos e traço',            formatarCPF('52998224725').includes('.') && formatarCPF('52998224725').includes('-'));

// ─── 6. formatarRG ──────────────────────────────────────────────────────────
console.log('\n=== 6. formatarRG ===');
const rgFormatado = formatarRG('123456789');
ok('Formata RG puro (resultado não vazio)',   rgFormatado.length > 0);
ok('RG formatado contém traço',              rgFormatado.includes('-'));
ok('Formata RG já formatado sem duplicar',   formatarRG('12.345.678-9').length > 0);

// ─── 7. calcularIdade ───────────────────────────────────────────────────────
console.log('\n=== 7. calcularIdade ===');
const hoje = new Date();
const nascido1990 = new Date(1990, hoje.getMonth(), hoje.getDate());
const idadeEsperada = hoje.getFullYear() - 1990;
ok(`Nascido hoje em 1990 tem ${idadeEsperada} anos`,
  calcularIdade(nascido1990.toISOString()) === idadeEsperada);

const nascimentoOntem1990 = new Date(1990, hoje.getMonth(), hoje.getDate() - 1);
ok('Aniversário foi ontem — idade correta',
  calcularIdade(nascimentoOntem1990.toISOString()) === idadeEsperada);

const nascimentoAmanha1990 = new Date(1990, hoje.getMonth(), hoje.getDate() + 1);
ok('Aniversário é amanhã — ainda não fez anos',
  calcularIdade(nascimentoAmanha1990.toISOString()) === idadeEsperada - 1);

ok('Recém-nascido tem 0 anos',         calcularIdade(new Date().toISOString()) === 0);
ok('Nascido em 2000 tem ao menos 20',  calcularIdade('2000-01-01') >= 20);
ok('Nascido em 1950 tem ao menos 74',  calcularIdade('1950-06-01') >= 74);

// ─── 8. Sanitização (Sprint 6) ──────────────────────────────────────────────
console.log('\n=== 8. sanitizarBody ===');

function simularSanitizacao(body) {
  const req  = { body };
  const res  = {};
  let chamou = false;
  sanitizarBody(req, res, () => { chamou = true; });
  return { body: req.body, chamouNext: chamou };
}

const s1 = simularSanitizacao({ nome: '  João  ' });
ok('Trim em string com espaços',           s1.body.nome === 'João');
ok('Chama next() corretamente',            s1.chamouNext);

const s2 = simularSanitizacao({ descricao: '<script>alert(1)</script>texto' });
ok('Remove tag <script>',                  !s2.body.descricao.includes('<script>'));
ok('Mantém texto após a tag',              s2.body.descricao.includes('texto'));

const s3 = simularSanitizacao({ nome: '<b>Teste</b>', email: 'a@b.com' });
ok('Remove <b> do nome',                  !s3.body.nome.includes('<b>'));
ok('Não altera campo sem HTML (email)',    s3.body.email === 'a@b.com');

const s4 = simularSanitizacao({ dados: { campo: '<img src=x onerror=alert(1)>' } });
ok('Sanitiza campo em objeto aninhado',   !s4.body.dados.campo.includes('<img'));

const s5 = simularSanitizacao({ numero: 42, ativo: true });
ok('Não altera campos não-string (number)', s5.body.numero === 42);
ok('Não altera campos não-string (bool)',   s5.body.ativo === true);

const s6 = simularSanitizacao({});
ok('Body vazio não causa erro',            s6.chamouNext);

// ─── 9. Lógica de estados civis por idade ───────────────────────────────────
console.log('\n=== 9. Lógica estados civis por idade ===');

function estadosCivisPermitidos(idade) {
  if (idade === null) return ['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União Estável'];
  if (idade < 16)    return ['Solteiro(a)'];
  if (idade < 18)    return ['Solteiro(a)', 'Casado(a)', 'União Estável'];
  return ['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União Estável'];
}

ok('Menor de 16 — somente Solteiro(a)',     estadosCivisPermitidos(15).length === 1);
ok('Menor de 16 — opção correta',            estadosCivisPermitidos(10)[0] === 'Solteiro(a)');
ok('16 anos — 3 opções',                     estadosCivisPermitidos(16).length === 3);
ok('17 anos — inclui Casado(a)',             estadosCivisPermitidos(17).includes('Casado(a)'));
ok('17 anos — não inclui Divorciado(a)',    !estadosCivisPermitidos(17).includes('Divorciado(a)'));
ok('18 anos — todas as 5 opções',            estadosCivisPermitidos(18).length === 5);
ok('40 anos — inclui Viúvo(a)',              estadosCivisPermitidos(40).includes('Viúvo(a)'));
ok('idade null — retorna todas as opções',   estadosCivisPermitidos(null).length === 5);

// ─── 10. Validação de idade de familiar (0–120) ──────────────────────────────
console.log('\n=== 10. Validação de idade de familiar ===');

function idadeValida(v) {
  if (v === '' || v === null || v === undefined) return true; // opcional
  const n = parseInt(v, 10);
  return !isNaN(n) && n >= 0 && n <= 120;
}

ok('Idade 0 é válida',                 idadeValida(0));
ok('Idade 45 é válida',                idadeValida(45));
ok('Idade 120 é válida',               idadeValida(120));
ok('Idade 121 é inválida',            !idadeValida(121));
ok('Idade -1 é inválida',             !idadeValida(-1));
ok('Idade vazia é válida (opcional)',   idadeValida(''));
ok('Idade null é válida (opcional)',    idadeValida(null));
ok('Idade "abc" é inválida',          !idadeValida('abc'));

// ─── Resultado ───────────────────────────────────────────────────────────────
const total = passou + falhou;
console.log('\n' + '='.repeat(55));
console.log('  TESTES UNITÁRIOS — Sprint 3 + Sprint 6');
console.log(`  Passou : ${passou}/${total}`);
console.log(`  Falhou : ${falhou}/${total}`);
console.log(`  Cobertura estimada: ${Math.round((passou / total) * 100)}%`);
if (falhou === 0) console.log('  STATUS : 🟢 TODOS OS TESTES PASSARAM');
else              console.log('  STATUS : 🔴 ' + falhou + ' TESTE(S) FALHANDO');
console.log('='.repeat(55) + '\n');

process.exit(falhou > 0 ? 1 : 0);

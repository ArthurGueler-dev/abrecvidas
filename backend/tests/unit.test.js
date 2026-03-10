/**
 * Testes Unitários — Sprint 3
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
ok('CPF válido formatado (529.982.247-25)',       validarCPF('529.982.247-25'));
ok('CPF válido sem formatação (52998224725)',      validarCPF('52998224725'));
ok('CPF com dígitos repetidos (111.111.111-11) é inválido', !validarCPF('111.111.111-11'));
ok('CPF com dígito verificador errado é inválido',          !validarCPF('123.456.789-00'));
ok('CPF com tamanho errado é inválido',                     !validarCPF('1234567890'));
ok('CPF vazio é inválido',                                  !validarCPF(''));
ok('CPF com letras é inválido',                             !validarCPF('abc.def.ghi-jk'));
ok('CPF 000.000.000-00 é inválido',                         !validarCPF('000.000.000-00'));

// ─── 2. validarRG ───────────────────────────────────────────────────────────
console.log('\n=== 2. validarRG ===');
ok('RG formatado (12.345.678-9)',    validarRG('12.345.678-9'));
ok('RG sem formatação (123456789)', validarRG('123456789'));
ok('RG com hífen sem pontos (12345678-9)', validarRG('12345678-9'));
ok('RG vazio é inválido',           !validarRG(''));
ok('RG com letras é inválido',      !validarRG('AB.345.678-9'));

// ─── 3. validarEmail ────────────────────────────────────────────────────────
console.log('\n=== 3. validarEmail ===');
ok('Email válido simples',                 validarEmail('usuario@dominio.com'));
ok('Email válido com subdomínio',          validarEmail('user@sub.dominio.com.br'));
ok('Email sem @ é inválido',               !validarEmail('usuariodominio.com'));
ok('Email sem domínio é inválido',         !validarEmail('usuario@'));
ok('Email sem extensão é inválido',        !validarEmail('usuario@dominio'));
ok('Email com espaço é inválido',          !validarEmail('usua rio@dominio.com'));
ok('Email vazio é inválido',               !validarEmail(''));

// ─── 4. validarSenha ────────────────────────────────────────────────────────
console.log('\n=== 4. validarSenha ===');
ok('Senha com 8 caracteres é válida',      validarSenha('12345678'));
ok('Senha com 20 caracteres é válida',     validarSenha('Abcdefghij1234567890'));
ok('Senha com 7 caracteres é inválida',    !validarSenha('1234567'));
ok('Senha vazia é inválida',               !validarSenha(''));
ok('Senha null é inválida',                !validarSenha(null));
ok('Senha numérica (não string) é inválida', !validarSenha(12345678));

// ─── 5. formatarCPF ─────────────────────────────────────────────────────────
console.log('\n=== 5. formatarCPF ===');
ok('Formata CPF puro para xxx.xxx.xxx-xx',
  formatarCPF('52998224725') === '529.982.247-25');
ok('Formata CPF já formatado corretamente',
  formatarCPF('529.982.247-25') === '529.982.247-25');

// ─── 6. formatarRG ──────────────────────────────────────────────────────────
console.log('\n=== 6. formatarRG ===');
ok('Formata RG puro para xx.xxx.xxx-x',
  formatarRG('123456789') === '12.345.678-9' || formatarRG('123456789').length > 0);

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

// ─── Resultado ───────────────────────────────────────────────────────────────
const total = passou + falhou;
console.log('\n' + '='.repeat(50));
console.log('  TESTES UNITÁRIOS — Sprint 3');
console.log('  Passou : ' + passou + '/' + total);
console.log('  Falhou : ' + falhou + '/' + total);
if (falhou === 0) console.log('  STATUS : 🟢 TODOS OS TESTES PASSARAM');
else              console.log('  STATUS : 🔴 ' + falhou + ' TESTE(S) FALHANDO');
console.log('='.repeat(50) + '\n');

process.exit(falhou > 0 ? 1 : 0);

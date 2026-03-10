const https = require('https');

const BASE = 'https://abrecvidas.onrender.com';
let passou = 0, falhou = 0;

function req(method, path, body, headers = {}) {
  return new Promise((resolve) => {
    const data = body ? JSON.stringify(body) : null;
    const url = new URL(BASE + path);
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data ? Buffer.byteLength(data) : 0,
        ...headers,
      },
    };
    const r = https.request(options, (res) => {
      let raw = '';
      res.on('data', (c) => raw += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, body: raw }); }
      });
    });
    r.on('error', (e) => resolve({ status: 0, body: e.message }));
    if (data) r.write(data);
    r.end();
  });
}

function ok(nome, cond, detalhe) {
  if (cond) { console.log('  ✅ ' + nome); passou++; }
  else { console.log('  ❌ ' + nome + (detalhe ? ' — ' + detalhe : '')); falhou++; }
}

async function run() {
  let token = '';
  let tokenProf = '';

  console.log('\n=== 1. AUTENTICAÇÃO ===');

  let r = await req('POST', '/api/auth/login', { email: 'admin@renascersc.org', senha: 'Admin@1234' });
  ok('Login com credenciais válidas retorna 200 + token', r.status === 200 && !!r.body.token);
  token = r.body.token || '';

  r = await req('POST', '/api/auth/login', { email: 'admin@renascersc.org', senha: 'senhaerrada' });
  ok('Senha incorreta retorna 401', r.status === 401);

  r = await req('POST', '/api/auth/login', { email: 'naoexiste@test.com', senha: '12345678' });
  ok('Email inexistente retorna 401', r.status === 401);

  r = await req('POST', '/api/auth/login', {});
  ok('Login sem campos retorna 400', r.status === 400);

  r = await req('POST', '/api/auth/login', { email: 'nao-e-email', senha: '12345678' });
  ok('Email inválido retorna 400', r.status === 400);

  console.log('\n=== 2. INJEÇÃO SQL ===');

  r = await req('POST', '/api/auth/login', { email: "' OR '1'='1", senha: "' OR '1'='1" });
  ok("SQL injection clássico é rejeitado", r.status !== 200);

  r = await req('POST', '/api/auth/login', { email: 'admin@renascersc.org; DROP TABLE usuarios;--', senha: 'x' });
  ok('SQL injection com DROP TABLE é rejeitado', r.status !== 200);

  r = await req('POST', '/api/auth/login', { email: '1; SELECT * FROM usuarios--', senha: 'x' });
  ok('SQL injection SELECT é rejeitado', r.status !== 200);

  console.log('\n=== 3. PROTEÇÃO DE ROTAS ===');

  r = await req('GET', '/api/auth/me');
  ok('GET /me sem token retorna 401', r.status === 401);

  r = await req('GET', '/api/users');
  ok('GET /users sem token retorna 401', r.status === 401);

  r = await req('GET', '/api/acolhidos');
  ok('GET /acolhidos sem token retorna 401', r.status === 401);

  r = await req('POST', '/api/users');
  ok('POST /users sem token retorna 401', r.status === 401);

  console.log('\n=== 4. JWT ===');

  r = await req('GET', '/api/auth/me', null, { Authorization: 'Bearer tokenfalso123' });
  ok('Token aleatório retorna 401', r.status === 401);

  r = await req('GET', '/api/auth/me', null, { Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6OTk5fQ.fake' });
  ok('JWT adulterado retorna 401', r.status === 401);

  r = await req('GET', '/api/auth/me', null, { Authorization: 'Bearer ' });
  ok('Token vazio retorna 401', r.status === 401);

  r = await req('GET', '/api/auth/me', null, { Authorization: 'Bearer ' + token });
  ok('Token válido acessa /me com sucesso', r.status === 200);

  console.log('\n=== 5. CONTROLE DE ACESSO POR PERFIL ===');

  r = await req('POST', '/api/auth/registrar', { email: 'hack@test.com', senha: '12345678', nome: 'Hack' });
  ok('Registrar sem token retorna 401', r.status === 401);

  const emailProf = 'prof.teste@renascersc.org';
  const senhaProf = 'Profissional@1';

  r = await req('POST', '/api/auth/registrar',
    { email: emailProf, senha: senhaProf, nome: 'Prof Teste', perfil: 'profissional' },
    { Authorization: 'Bearer ' + token }
  );
  ok('Admin registra novo profissional (201 ou já existia 409)', r.status === 201 || r.status === 409);

  r = await req('POST', '/api/auth/login', { email: emailProf, senha: senhaProf });
  ok('Profissional faz login', r.status === 200);
  tokenProf = r.body.token || '';

  r = await req('GET', '/api/users', null, { Authorization: 'Bearer ' + tokenProf });
  ok('Profissional NÃO acessa rota admin /users (403)', r.status === 403);

  r = await req('POST', '/api/auth/registrar',
    { email: 'outro@test.com', senha: '12345678', nome: 'Outro' },
    { Authorization: 'Bearer ' + tokenProf }
  );
  ok('Profissional NÃO pode registrar usuário (403)', r.status === 403);

  r = await req('GET', '/api/users', null, { Authorization: 'Bearer ' + token });
  ok('Admin acessa /users normalmente (200)', r.status === 200);

  console.log('\n=== 6. HEALTH CHECK ===');
  r = await req('GET', '/api/health');
  ok('Health check retorna ok', r.status === 200 && r.body.status === 'ok');

  const total = passou + falhou;
  console.log('\n' + '='.repeat(50));
  console.log('  RESULTADO FINAL');
  console.log('  Passou : ' + passou + '/' + total);
  console.log('  Falhou : ' + falhou + '/' + total);
  if (falhou === 0) console.log('  STATUS : 🟢 TODOS OS TESTES PASSARAM');
  else console.log('  STATUS : 🔴 ' + falhou + ' TESTE(S) FALHANDO');
  console.log('='.repeat(50) + '\n');

  process.exit(falhou > 0 ? 1 : 0);
}

run().catch((e) => { console.error(e); process.exit(1); });

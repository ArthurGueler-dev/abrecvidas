const pool = require('./database');

const SQL_SPRINT3 = `
  CREATE TABLE IF NOT EXISTS acolhidos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    rg VARCHAR(20) UNIQUE,
    data_nascimento DATE,
    sexo ENUM('M','F','Outro') DEFAULT 'M',
    estado_civil VARCHAR(50),
    telefone VARCHAR(20) NOT NULL,
    telefone_secundario VARCHAR(20),
    email VARCHAR(255),
    endereco TEXT,
    cep VARCHAR(10),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    data_admissao DATE NOT NULL,
    data_alta DATE,
    status ENUM('ativo','inativo','alta') DEFAULT 'ativo',
    foto_url VARCHAR(500),
    foto_public_id VARCHAR(255),
    criado_por INT UNSIGNED,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_por INT UNSIGNED,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (criado_por) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (atualizado_por) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_cpf (cpf),
    INDEX idx_nome (nome),
    INDEX idx_status (status)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

  CREATE TABLE IF NOT EXISTS evolucoes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    acolhido_id INT NOT NULL,
    profissional_id INT UNSIGNED,
    descricao TEXT NOT NULL,
    tipo VARCHAR(50),
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (acolhido_id) REFERENCES acolhidos(id) ON DELETE CASCADE,
    FOREIGN KEY (profissional_id) REFERENCES usuarios(id) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

const SQL_SPRINT4 = `
  CREATE TABLE IF NOT EXISTS acolhido_familia (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    acolhido_id INT NOT NULL,
    nome VARCHAR(200) NOT NULL,
    parentesco VARCHAR(50) NOT NULL,
    idade INT UNSIGNED,
    telefone VARCHAR(20),
    situacao VARCHAR(50),
    observacoes TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (acolhido_id) REFERENCES acolhidos(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

  CREATE TABLE IF NOT EXISTS acolhido_saude (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    acolhido_id INT NOT NULL UNIQUE,
    tipo_sanguineo VARCHAR(5),
    alergias TEXT,
    medicamentos_em_uso TEXT,
    condicoes_cronicas TEXT,
    historico_psiquiatrico TEXT,
    tentativas_suicidio TINYINT(1) DEFAULT 0,
    numero_tentativas INT UNSIGNED DEFAULT 0,
    acompanhamento_psicologico TINYINT(1) DEFAULT 0,
    acompanhamento_psiquiatrico TINYINT(1) DEFAULT 0,
    observacoes TEXT,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (acolhido_id) REFERENCES acolhidos(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

  CREATE TABLE IF NOT EXISTS acolhido_substancias (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    acolhido_id INT NOT NULL UNIQUE,
    usa_alcool TINYINT(1) DEFAULT 0,
    alcool_frequencia VARCHAR(50),
    alcool_tempo_uso VARCHAR(50),
    usa_drogas TINYINT(1) DEFAULT 0,
    drogas_tipos TEXT,
    drogas_tempo_uso VARCHAR(50),
    usa_medicamentos_abuso TINYINT(1) DEFAULT 0,
    medicamentos_tipos TEXT,
    internacoes_anteriores INT UNSIGNED DEFAULT 0,
    tentativas_recuperacao INT UNSIGNED DEFAULT 0,
    motivacao_tratamento TEXT,
    observacoes TEXT,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (acolhido_id) REFERENCES acolhidos(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

  CREATE TABLE IF NOT EXISTS acolhido_historico_profissional (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    acolhido_id INT NOT NULL UNIQUE,
    escolaridade VARCHAR(60),
    ultima_ocupacao VARCHAR(200),
    area_atuacao VARCHAR(100),
    tempo_desempregado VARCHAR(50),
    fonte_renda VARCHAR(100),
    beneficios_sociais TEXT,
    habilidades TEXT,
    observacoes TEXT,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (acolhido_id) REFERENCES acolhidos(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

  CREATE TABLE IF NOT EXISTS acolhido_avaliacao (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    acolhido_id INT NOT NULL,
    profissional_id INT UNSIGNED,
    data_avaliacao DATE NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    descricao TEXT NOT NULL,
    plano_terapeutico TEXT,
    proxima_avaliacao DATE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (acolhido_id) REFERENCES acolhidos(id) ON DELETE CASCADE,
    FOREIGN KEY (profissional_id) REFERENCES usuarios(id) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

async function migrar() {
  const conn = await pool.getConnection();
  try {
    const executar = async (sql) => {
      const queries = sql.split(';').map(q => q.trim()).filter(q => q.length > 0);
      for (const q of queries) await conn.execute(q);
    };

    await executar(SQL_SPRINT3);
    console.log('✅ Tabelas Sprint 3 verificadas');

    await executar(SQL_SPRINT4);
    console.log('✅ Tabelas Sprint 4 criadas');

    console.log('✅ Migração concluída');
  } catch (err) {
    console.error('❌ Erro na migração:', err.message);
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = migrar;

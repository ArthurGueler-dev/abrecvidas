const pool = require('./database');

const SQL = `
  DROP TABLE IF EXISTS acolhido_saude, evolucoes, acolhido_contatos, acolhido_enderecos, acolhidos;

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
    data_admissao DATE NOT NULL DEFAULT (CURDATE()),
    data_alta DATE,
    status ENUM('ativo','inativo','alta') DEFAULT 'ativo',
    foto_url VARCHAR(500),
    foto_public_id VARCHAR(255),
    criado_por INT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_por INT,
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
    profissional_id INT,
    descricao TEXT NOT NULL,
    tipo VARCHAR(50),
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (acolhido_id) REFERENCES acolhidos(id) ON DELETE CASCADE,
    FOREIGN KEY (profissional_id) REFERENCES usuarios(id) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

async function migrar() {
  try {
    const conn = await pool.getConnection();
    const queries = SQL.split(';').map(q => q.trim()).filter(q => q.length > 0);
    for (const q of queries) {
      await conn.execute(q);
    }
    conn.release();
    console.log('✅ Migração Sprint 3 concluída');
  } catch (err) {
    console.error('❌ Erro na migração:', err.message);
    throw err;
  }
}

module.exports = migrar;

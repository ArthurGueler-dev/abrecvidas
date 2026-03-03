-- ============================================================
-- Sistema de Gerenciamento de Acolhidos
-- Associação Beneficente Renascer em Cristo
-- Script de criação do banco de dados - Sprint 2
-- ============================================================

CREATE DATABASE IF NOT EXISTS renascer_em_cristo
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE renascer_em_cristo;

-- ============================================================
-- Tabela: usuarios (perfis do sistema)
-- ============================================================
CREATE TABLE IF NOT EXISTS usuarios (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome        VARCHAR(150)        NOT NULL,
  email       VARCHAR(200)        NOT NULL UNIQUE,
  senha_hash  VARCHAR(255)        NOT NULL,
  perfil      ENUM('admin', 'profissional', 'visualizador') NOT NULL DEFAULT 'profissional',
  ativo       TINYINT(1)          NOT NULL DEFAULT 1,
  criado_em   DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Tabela: acolhidos (Sprint 3)
-- ============================================================
CREATE TABLE IF NOT EXISTS acolhidos (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome             VARCHAR(200)  NOT NULL,
  cpf              CHAR(14)      UNIQUE,
  rg               VARCHAR(20),
  data_nascimento  DATE,
  sexo             ENUM('masculino', 'feminino', 'outro'),
  estado_civil     ENUM('solteiro', 'casado', 'divorciado', 'viuvo', 'uniao_estavel'),
  foto_url         VARCHAR(500),
  status           ENUM('ativo', 'inativo', 'alta') NOT NULL DEFAULT 'ativo',
  criado_por       INT UNSIGNED,
  criado_em        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (criado_por) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Tabela: acolhido_enderecos (Sprint 3)
-- ============================================================
CREATE TABLE IF NOT EXISTS acolhido_enderecos (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  acolhido_id  INT UNSIGNED NOT NULL,
  cep          CHAR(9),
  logradouro   VARCHAR(200),
  numero       VARCHAR(20),
  complemento  VARCHAR(100),
  bairro       VARCHAR(100),
  cidade       VARCHAR(100),
  uf           CHAR(2),
  FOREIGN KEY (acolhido_id) REFERENCES acolhidos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Tabela: acolhido_contatos (Sprint 3)
-- ============================================================
CREATE TABLE IF NOT EXISTS acolhido_contatos (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  acolhido_id  INT UNSIGNED NOT NULL,
  tipo         ENUM('celular', 'fixo', 'emergencia') NOT NULL,
  numero       VARCHAR(20)  NOT NULL,
  responsavel  VARCHAR(150),
  FOREIGN KEY (acolhido_id) REFERENCES acolhidos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Tabela: acolhido_saude (Sprint 4)
-- ============================================================
CREATE TABLE IF NOT EXISTS acolhido_saude (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  acolhido_id      INT UNSIGNED NOT NULL,
  doencas          TEXT,
  medicamentos     TEXT,
  alergias         TEXT,
  observacoes      TEXT,
  atualizado_por   INT UNSIGNED,
  atualizado_em    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (acolhido_id) REFERENCES acolhidos(id) ON DELETE CASCADE,
  FOREIGN KEY (atualizado_por) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Tabela: evolucoes (Sprint 5 - acompanhamento/timeline)
-- ============================================================
CREATE TABLE IF NOT EXISTS evolucoes (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  acolhido_id  INT UNSIGNED NOT NULL,
  profissional_id INT UNSIGNED,
  descricao    TEXT         NOT NULL,
  tipo         VARCHAR(50),
  criado_em    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (acolhido_id) REFERENCES acolhidos(id) ON DELETE CASCADE,
  FOREIGN KEY (profissional_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Usuário administrador inicial (senha: Admin@1234)
-- ALTERE A SENHA IMEDIATAMENTE APÓS O PRIMEIRO LOGIN!
-- ============================================================
INSERT INTO usuarios (nome, email, senha_hash, perfil)
VALUES (
  'Administrador',
  'admin@renascersc.org',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- Admin@1234
  'admin'
) ON DUPLICATE KEY UPDATE id = id;

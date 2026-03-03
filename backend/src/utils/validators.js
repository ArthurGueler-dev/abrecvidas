/**
 * Valida CPF brasileiro.
 * @param {string} cpf
 * @returns {boolean}
 */
const validarCPF = (cpf) => {
  const limpo = cpf.replace(/\D/g, '');
  if (limpo.length !== 11 || /^(\d)\1+$/.test(limpo)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(limpo[i]) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(limpo[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(limpo[i]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(limpo[10]);
};

/**
 * Formata CPF: 000.000.000-00
 * @param {string} cpf
 * @returns {string}
 */
const formatarCPF = (cpf) => {
  const limpo = cpf.replace(/\D/g, '');
  return limpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Valida email.
 * @param {string} email
 * @returns {boolean}
 */
const validarEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Valida força da senha (mínimo 8 caracteres).
 * @param {string} senha
 * @returns {boolean}
 */
const validarSenha = (senha) => {
  return typeof senha === 'string' && senha.length >= 8;
};

module.exports = { validarCPF, formatarCPF, validarEmail, validarSenha };

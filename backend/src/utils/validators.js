const validarCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf[10]);
};

const validarRG = (rg) => {
  return /^\d{1,3}\.?\d{3}\.?\d{3}-?\d{1}$/.test(rg.replace(/\s/g, ''));
};

const validarEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validarSenha = (senha) => {
  return typeof senha === 'string' && senha.length >= 8;
};

const formatarCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]/g, '');
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const formatarRG = (rg) => {
  rg = rg.replace(/[^\d]/g, '');
  return rg.replace(/(\d{1,3})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
};

const calcularIdade = (dataNascimento) => {
  const hoje = new Date();
  const nasc = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nasc.getFullYear();
  if (hoje.getMonth() < nasc.getMonth() ||
     (hoje.getMonth() === nasc.getMonth() && hoje.getDate() < nasc.getDate())) {
    idade--;
  }
  return idade;
};

module.exports = { validarCPF, validarRG, validarEmail, validarSenha, formatarCPF, formatarRG, calcularIdade };

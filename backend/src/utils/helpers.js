/**
 * Remove campos undefined/null de um objeto.
 * @param {object} obj
 * @returns {object}
 */
const limparObjeto = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null)
  );
};

/**
 * Retorna a data atual no formato ISO 8601.
 * @returns {string}
 */
const agora = () => new Date().toISOString();

module.exports = { limparObjeto, agora };

const pool = require('../config/database');

// GET /api/relatorios/estatisticas
const obterEstatisticas = async (req, res, next) => {
  try {
    const [[{ total }]]   = await pool.execute('SELECT COUNT(*) as total FROM acolhidos');
    const [[{ ativos }]]  = await pool.execute("SELECT COUNT(*) as ativos FROM acolhidos WHERE status = 'ativo'");
    const [[{ inativos }]]= await pool.execute("SELECT COUNT(*) as inativos FROM acolhidos WHERE status = 'inativo'");
    const [[{ alta }]]    = await pool.execute("SELECT COUNT(*) as alta FROM acolhidos WHERE status = 'alta'");
    const [[{ mes }]]     = await pool.execute(
      "SELECT COUNT(*) as mes FROM acolhidos WHERE MONTH(data_admissao) = MONTH(CURDATE()) AND YEAR(data_admissao) = YEAR(CURDATE())"
    );

    const [porSexo] = await pool.execute(
      "SELECT sexo, COUNT(*) as total FROM acolhidos GROUP BY sexo ORDER BY total DESC"
    );

    const [admissoesMensais] = await pool.execute(
      `SELECT DATE_FORMAT(data_admissao, '%Y-%m') as mes, COUNT(*) as total
       FROM acolhidos
       WHERE data_admissao >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
       GROUP BY DATE_FORMAT(data_admissao, '%Y-%m')
       ORDER BY mes ASC`
    );

    const [evolucoesMensais] = await pool.execute(
      `SELECT DATE_FORMAT(criado_em, '%Y-%m') as mes, COUNT(*) as total
       FROM evolucoes
       WHERE criado_em >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
       GROUP BY DATE_FORMAT(criado_em, '%Y-%m')
       ORDER BY mes ASC`
    );

    res.json({
      sucesso: true,
      dados: { total, ativos, inativos, alta, mes, porSexo, admissoesMensais, evolucoesMensais },
    });
  } catch (err) { next(err); }
};

module.exports = { obterEstatisticas };

const path = require('path');
const knex = require('knex');

// Carrega o knexfile (pode exportar objeto com ambientes)
const knexfilePath = path.resolve(__dirname, '..', 'knexfile.cjs');
const knexfile = require(knexfilePath);
const env = process.env.NODE_ENV || 'development';
const config = knexfile[env] || knexfile;

const db = knex(config);

(async () => {
  try {
    const rows = await db('knex_migrations').select('*').orderBy('id');
    if (!rows || rows.length === 0) {
      console.log('Nenhuma migration aplicada encontrada na tabela `knex_migrations`.');
    } else {
      console.log('Migrations aplicadas (amostra):');
      rows.forEach(r => console.log(r));
    }
  } catch (err) {
    console.error('Erro ao consultar knex_migrations:', err && err.message ? err.message : err);
    process.exitCode = 1;
  } finally {
    await db.destroy();
  }
})();

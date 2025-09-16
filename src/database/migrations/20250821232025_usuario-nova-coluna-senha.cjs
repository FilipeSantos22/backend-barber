/**
 * Adiciona coluna 'senha' (string) na tabela 'users'
 */
exports.up = async function(knex) {
  const has = await knex.schema.hasTable('users');
  if (!has) {
      return;
  }
  await knex.schema.alterTable('users', (table) => {
    // adiciona coluna como nullable para não quebrar registros existentes
    table.string('senha', 255).nullable();
  });
};

exports.down = async function(knex) {
    const has = await knex.schema.hasTable('users');
    if (!has) {
        return;
    }
    await knex.schema.alterTable('users', (table) => {
        table.dropColumn('senha');
    });
};
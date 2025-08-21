/**
 * Adiciona coluna 'senha' (string) na tabela 'usuarios'
 */
exports.up = async function(knex) {
  const has = await knex.schema.hasTable('usuarios');
  if (!has) {
      return;
  }
  await knex.schema.alterTable('usuarios', (table) => {
    // adiciona coluna como nullable para não quebrar registros existentes
    table.string('senha', 255).nullable();
  });
};

exports.down = async function(knex) {
    const has = await knex.schema.hasTable('usuarios');
    if (!has) {
        return;
    }
    await knex.schema.alterTable('usuarios', (table) => {
        table.dropColumn('senha');
    });
};
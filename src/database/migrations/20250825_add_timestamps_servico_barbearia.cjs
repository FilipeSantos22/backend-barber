module.exports.up = async function (knex) {
  const exists = await knex.schema.hasTable('servico_barbearia');
  if (!exists) return;

  await knex.schema.alterTable('servico_barbearia', (table) => {
    table.timestamp('data_criacao').notNullable().defaultTo(knex.fn.now());
    table.timestamp('data_atualizacao').nullable().defaultTo(knex.fn.now());
  });
};

module.exports.down = async function (knex) {
  const exists = await knex.schema.hasTable('servico_barbearia');
  if (!exists) return;

  await knex.schema.alterTable('servico_barbearia', (table) => {
    table.dropColumn('data_criacao');
    table.dropColumn('data_atualizacao');
  });
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

module.exports.up = async function (knex) {
  const exists = await knex.schema.hasTable('servico_barbeiro');
  if (!exists) return;

  await knex.schema.alterTable('servico_barbeiro', (table) => {
    table.timestamp('data_criacao').notNullable().defaultTo(knex.fn.now());
    table.timestamp('data_atualizacao').nullable().defaultTo(knex.fn.now());
  });
};

module.exports.down = async function (knex) {
  const exists = await knex.schema.hasTable('servico_barbeiro');
  if (!exists) return;

  await knex.schema.alterTable('servico_barbeiro', (table) => {
    table.dropColumn('data_criacao');
    table.dropColumn('data_atualizacao');
  });
};
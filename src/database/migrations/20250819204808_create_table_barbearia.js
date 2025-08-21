/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('barbearia', function(table) {
    table.increments('idBarbearia').primary();
    table.string('nome', 255).notNullable();
    table.string('endereco', 255);
    table.string('telefone', 20);
    table.timestamp('data_criacao').notNullable().defaultTo(knex.fn.now());
    table.timestamp('data_atualizacao').notNullable().defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('barbearia');
};

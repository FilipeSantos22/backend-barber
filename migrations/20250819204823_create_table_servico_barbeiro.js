/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('servico_barbeiro', function(table) {
    table.integer('idServico').notNullable()
      .references('idServico').inTable('servico')
      .onDelete('CASCADE');
    table.integer('idBarbeiro').notNullable()
      .references('idUsuario').inTable('usuarios')
      .onDelete('CASCADE');
    table.primary(['idServico', 'idBarbeiro']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('servico_barbeiro');
};

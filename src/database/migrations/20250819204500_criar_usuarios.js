/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Cria a tabela usuarios
  await knex.schema.createTable('usuarios', function(table) {
    table.increments('idUsuario').primary();
    table.string('nome', 255);
    table.string('email', 255).unique();
    table.string('telefone', 20);
    table.string('tipo', 20);
    table.timestamp('data_criacao').notNullable().defaultTo(knex.fn.now());
    table.timestamp('data_atualizacao').notNullable().defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('usuarios');
};

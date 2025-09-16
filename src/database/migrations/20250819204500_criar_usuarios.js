/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Cria a tabela users
  await knex.schema.createTable('users', function(table) { // alterei o nome para 'users' - 16/09/25
    table.increments('id').primary();
    table.string('name', 255);
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
  await knex.schema.dropTableIfExists('users'); // alterei o nome para 'users' - 16/09/25
};

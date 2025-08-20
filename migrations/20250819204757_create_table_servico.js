/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable('servico', function(table) {
    table.increments('idServico').primary();
    table.string('nome', 255).notNullable();
    table.decimal('preco', 10, 2).notNullable();
    table.integer('duracao_minutos');
    table.integer('idBarbearia').notNullable().references('idBarbearia').inTable('barbearia');
    table.timestamp('data_criacao').notNullable().defaultTo(knex.fn.now());
    table.timestamp('data_atualizacao').notNullable().defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('servico');
};

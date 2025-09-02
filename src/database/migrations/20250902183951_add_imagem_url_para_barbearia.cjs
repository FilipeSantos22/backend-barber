
exports.up = function(knex) {
  return knex.schema.alterTable('barbearia', function(table) {
    // URL da imagem da barbearia (nullable)
    table.string('imagem_url', 2048);
  });
};

exports.down = function(knex) {
    return knex.schema.alterTable('barbearia', function(table) {
    table.dropColumn('imagem_url');
  });
};

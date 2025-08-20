// Rota para obter todos os serviços
app.get('/api/servicos', async (req, res) => {
  const servicos = await knex('servicos').select('*');
  res.json(servicos);
});
// Exemplo de rota no Express
app.get('/api/usuarios', async (req, res) => {
  const usuarios = await knex('usuarios').select('*');
  res.json(usuarios);
});

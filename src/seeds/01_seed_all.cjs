/**
 * Seed que popula tabelas de teste (barbearia, usuarios, servico, servico_barbeiro, agendamento).
 * Execute:
 * npx knex seed:run --knexfile ./knexfile.cjs
 */

module.exports.seed = async function(knex) {
  const trx = await knex.transaction();
  try {
    // --- BARBEARIAS ---
    const barbeariasSeed = [
      { nome: 'Barbearia Central', endereco: 'Av. Principal, 100', telefone: '(11) 1111-1111' },
      { nome: 'Barbearia Oeste', endereco: 'Rua Secundária, 45', telefone: '(11) 2222-2222' }
    ];

    const barbeariaExists = await trx.schema.hasTable('barbearia');
    let barbearias = [];
    let barbeariaIdKey = null;

    if (barbeariaExists) {
      // tenta inserir e retornar (Postgres suporta returning)
      try {
        barbearias = await trx('barbearia').insert(barbeariasSeed).returning('*');
      } catch (e) {
        // fallback: insere sem returning e busca pelos nomes
        await trx('barbearia').insert(barbeariasSeed);
        barbearias = await trx('barbearia').whereIn('nome', barbeariasSeed.map(b => b.nome)).select('*');
      }
      if (barbearias.length > 0) {
        const sample = barbearias[0];
        barbeariaIdKey = Object.keys(sample).find(k => /^id$|idbarbearia$/i.test(k));
      }
    }

    // --- USUÁRIOS ---
    const usuariosSeed = [
      { nome: 'Admin', email: 'admin@barber.com', telefone: '(11) 3000-0000', tipo: 'admin' },
      { nome: 'Barbeiro One', email: 'barbeiro1@barber.com', telefone: '(11) 4000-0000', tipo: 'barbeiro' },
      { nome: 'Cliente One', email: 'cliente1@barber.com', telefone: '(11) 5000-0000', tipo: 'cliente' }
    ];

    const usuariosExists = await trx.schema.hasTable('usuarios');
    let usuarios = [];
    let usuarioIdKey = null;

    if (usuariosExists) {
      try {
        usuarios = await trx('usuarios').insert(usuariosSeed).returning('*');
      } catch (e) {
        await trx('usuarios').insert(usuariosSeed);
        usuarios = await trx('usuarios').whereIn('email', usuariosSeed.map(u => u.email)).select('*');
      }
      if (usuarios.length > 0) {
        const sample = usuarios[0];
        // espera-se idUsuario como PK, mas detecta variações
        usuarioIdKey = Object.keys(sample).find(k => /^idusuario$|^id$/i.test(k));
      }
    }

    // --- SERVIÇOS ---
    const servicoExists = await trx.schema.hasTable('servico');
    let servicos = [];
    let servicoIdKey = null;

    if (servicoExists && barbearias.length > 0) {
      // usa a primeira barbearia inserida como referência
      const barbeariaFkValue = barbearias[0][barbeariaIdKey];

      const servicosSeed = [
        { nome: 'Cabelo', preco: 25.00, duracao_minutos: 30, idBarbearia: barbeariaFkValue },
        { nome: 'Barba', preco: 40.00, duracao_minutos: 50, idBarbearia: barbeariaFkValue }
      ];

      try {
        servicos = await trx('servico').insert(servicosSeed).returning('*');
      } catch (e) {
        await trx('servico').insert(servicosSeed);
        servicos = await trx('servico').whereIn('nome', servicosSeed.map(s => s.nome)).select('*');
      }
      if (servicos.length > 0) {
        const sample = servicos[0];
        servicoIdKey = Object.keys(sample).find(k => /^idservico$|^id$/i.test(k));
      }
    }

    // --- SERVICO_BARBEIRO (associação) ---
    const servicoBarbeiroExists = await trx.schema.hasTable('servico_barbeiro');
    if (servicoBarbeiroExists && servicos.length > 0 && usuarios.length > 0) {
      // encontra um barbeiro e um serviço
      const barbeiro = usuarios.find(u => String(u.tipo)?.toLowerCase() === 'barbeiro') || usuarios[1];
      const cliente = usuarios.find(u => String(u.tipo)?.toLowerCase() === 'cliente') || usuarios[2];

      const idServico = servicos[0][servicoIdKey];
      const idBarbeiro = barbeiro[usuarioIdKey];

      // insere associação (evita duplicados)
      const existsAssoc = await trx('servico_barbeiro')
        .where({ idServico, idBarbeiro })
        .first();

      if (!existsAssoc) {
        await trx('servico_barbeiro').insert({ idServico, idBarbeiro });
      }
    }

    // --- AGENDAMENTO ---
    const agendamentoExists = await trx.schema.hasTable('agendamento');
    if (agendamentoExists && usuarios.length > 0 && servicos.length > 0 && barbearias.length > 0) {
      const cliente = usuarios.find(u => String(u.tipo)?.toLowerCase() === 'cliente') || usuarios[2];
      const barbeiro = usuarios.find(u => String(u.tipo)?.toLowerCase() === 'barbeiro') || usuarios[1];
      const serv = servicos[0];
      const bar = barbearias[0];

      // monta objeto de inserção com os nomes de colunas esperados (detecção)
      const agInsert = {};
      // detecta nomes das colunas existentes na tabela agendamento
      const cols = await trx('agendamento').columnInfo();

      if (cols['idUsuario']) agInsert['idUsuario'] = cliente[usuarioIdKey];
      else if (cols['id_usuario']) agInsert['id_usuario'] = cliente[usuarioIdKey];

      if (cols['idBarbeiro']) agInsert['idBarbeiro'] = barbeiro[usuarioIdKey];
      else if (cols['id_barbeiro']) agInsert['id_barbeiro'] = barbeiro[usuarioIdKey];

      if (cols['idServico']) agInsert['idServico'] = serv[servicoIdKey];
      else if (cols['servicoId']) agInsert['servicoId'] = serv[servicoIdKey];
      else if (cols['id_servico']) agInsert['id_servico'] = serv[servicoIdKey];

      // idBarbearia pode ter nome idBarbearia ou id (ou idBarbearia)
      if (cols['idBarbearia']) agInsert['idBarbearia'] = bar[barbeariaIdKey];
      else if (cols['idBarbearia'] === undefined && cols['idbarbearia']) agInsert['idbarbearia'] = bar[barbeariaIdKey];
      else if (cols['id']) agInsert['id'] = bar[barbeariaIdKey]; // cuidado: raro

      // data_hora / descricao
      if (cols['data_hora']) agInsert['data_hora'] = new Date(Date.now() + 24*60*60*1000); // amanhã
      else if (cols['datahora']) agInsert['datahora'] = new Date(Date.now() + 24*60*60*1000);

      if (cols['descricao']) agInsert['descricao'] = 'Agendamento de teste via seed';

      // insere apenas se conseguiu mapear as chaves importantes
      const required = ['idUsuario','idBarbeiro','idServico','idBarbearia'];
      const mapped = Object.keys(agInsert).map(k => k.toLowerCase());
      const hasRequired = required.every(r => mapped.includes(r.toLowerCase()));
      if (hasRequired) {
        // evita duplicação buscando por combinação
        const exists = await trx('agendamento').where({
          // ajusta para os nomes reais presentes no agInsert
          ...(agInsert.idUsuario ? { idUsuario: agInsert.idUsuario } : {}),
          ...(agInsert.idBarbeiro ? { idBarbeiro: agInsert.idBarbeiro } : {}),
          ...(agInsert.idServico ? { idServico: agInsert.idServico } : {}),
          ...(agInsert.idBarbearia ? { idBarbearia: agInsert.idBarbearia } : {})
        }).first();

        if (!exists) {
          await trx('agendamento').insert(agInsert);
        }
      }
    }

    await trx.commit();
    // eslint-disable-next-line no-console
    console.log('Seeds aplicadas com sucesso (quando as tabelas existem).');
  } catch (err) {
    await trx.rollback();
    // eslint-disable-next-line no-console
    console.error('Erro ao rodar seeds:', err);
    throw err;
  }
};
import { Router } from 'express';
import usuariosRouter from './usuarios.routes';
import barbeariasRouter from './barbearias.routes';
import servicosRouter from './servicos.routes';
import agendamentosRouter from './agendamentos.routes';
import servicosBarbeiroRouter from './servico_barbeiro.routes';
import accountsRouter from './accounts.routes';
import sessionsRouter from './sessions.routes';
import verificationTokensRouter from './verification_tokens.routes';

const router = Router();

// monta todas as rotas da API sob /api
router.use('/usuarios', usuariosRouter);
router.use('/barbearias', barbeariasRouter);
router.use('/servicos', servicosRouter);
router.use('/agendamentos', agendamentosRouter);
router.use('/servicos-barbeiro', servicosBarbeiroRouter);
router.use('/accounts', accountsRouter);
router.use('/sessions', sessionsRouter);
router.use('/verification_tokens', verificationTokensRouter);


// Paginação, filtros e performance (recomendado)
// Adicionar limit/offset, filtro por barbearia/servico/status e ordenação nas listagens.
// Índices DB nas colunas usadas em WHERE (idBarbearia, idBarbeiro, excluido).


export default router;
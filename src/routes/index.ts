import { Router } from 'express';
import usuariosRouter from './usuarios.routes';
import barbeariasRouter from './barbearias.routes';
import servicosRouter from './servicos.routes';
import agendamentosRouter from './agendamentos.routes';
import servicosBarbeiroRouter from './servico_barbeiro.routes';

const router = Router();

// monta todas as rotas da API sob /api
router.use('/usuarios', usuariosRouter);
router.use('/barbearias', barbeariasRouter);
router.use('/servicos', servicosRouter);
router.use('/agendamentos', agendamentosRouter);
router.use('/servicos-barbeiro', servicosBarbeiroRouter);


export default router;
import { Router } from 'express';
import usuariosRouter from './usuarios.routes';

const router = Router();

// monta todas as rotas da API sob /api
router.use('/usuarios', usuariosRouter);

// aqui você pode adicionar outras rotas, ex:
// import servicosRouter from './servicos.routes';
// router.use('/servicos', servicosRouter);

export default router;
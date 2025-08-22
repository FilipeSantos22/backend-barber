import { Router } from 'express';
import { asyncHandler } from '../middlewares/error';
import { ServicosController } from '../controllers/servicos.controller';

const router = Router();

router.get('/', asyncHandler(ServicosController.listar));
router.post('/', asyncHandler(ServicosController.criar));
router.get('/:id', asyncHandler(ServicosController.buscarPorId));
router.put('/:id', asyncHandler(ServicosController.atualizar));
router.delete('/:id', asyncHandler(ServicosController.remover));

export default router;
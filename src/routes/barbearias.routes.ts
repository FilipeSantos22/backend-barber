import { Router } from 'express';
import { asyncHandler } from '../middlewares/error';
import { BarbeariasController } from '../controllers/barbearias.controller';

const router = Router();

// lista e cria
router.get('/', asyncHandler(BarbeariasController.listar));
router.post('/', asyncHandler(BarbeariasController.criar));

// operações por id (apenas dígitos)
router.get('/:id', asyncHandler(BarbeariasController.buscarPorId));
router.put('/:id', asyncHandler(BarbeariasController.atualizar));
router.delete('/:id', asyncHandler(BarbeariasController.remover));

export default router;
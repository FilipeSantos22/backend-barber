import { Router } from 'express';
import { asyncHandler } from '../middlewares/error';
import { AgendamentosController } from '../controllers/agendamentos.controller';

const router = Router();

router.get('/', asyncHandler(AgendamentosController.listar));
router.post('/', asyncHandler(AgendamentosController.criar));
router.get('/:id', asyncHandler(AgendamentosController.buscarPorIdUsuario));
router.put('/:id', asyncHandler(AgendamentosController.atualizar));
router.delete('/:id', asyncHandler(AgendamentosController.remover));
router.patch('/:id/status', asyncHandler(AgendamentosController.atualizarStatus));

export default router;
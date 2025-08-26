import { Router } from 'express';
import { asyncHandler } from '../middlewares/error';
import { ServicoBarbeiroController } from '../controllers/servico_barbeiro.controller';

const router = Router();

// cria relação entre serviço e barbeiro
router.post('/', asyncHandler(ServicoBarbeiroController.criar));
router.get('/', asyncHandler(ServicoBarbeiroController.listar));

router.get('/barbeiro/:id', asyncHandler(ServicoBarbeiroController.listarServicosPorBarbeiro));
router.delete('/barbeiro/:id', asyncHandler(ServicoBarbeiroController.removerPorBarbeiro));

router.get('/servico/:id', asyncHandler(ServicoBarbeiroController.listarServicosPorServico));
router.delete('/servico/:id', asyncHandler(ServicoBarbeiroController.removerPorServico));

export default router;
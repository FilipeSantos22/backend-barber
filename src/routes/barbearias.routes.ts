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

// GET /api/barbearias/:id/servicos (serviços de uma barbearia).
router.get('/:id/servicos', asyncHandler(BarbeariasController.listarServicos));


// GET /api/barbearias/:id/agendamentos ou /api/barbeiros/:id/agendamentos (para painel do estabelecimento).
router.get('/:id/agendamentos', asyncHandler(BarbeariasController.listarAgendamentosBarbearia));

// POST/PUT para confirmar/cancelar/finalizar (status) e checar conflitos.
router.put('/:id/agendamentos/:idAgendamento', asyncHandler(BarbeariasController.atualizarAgendamento));

export default router;
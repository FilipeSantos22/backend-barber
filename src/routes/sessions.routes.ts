import { Router } from 'express';
import { asyncHandler } from '../middlewares/error';
import { SessionsController } from '../controllers/sessions.controller';

const router = Router();

router.post('/', asyncHandler(SessionsController.createSession));
router.get('/', asyncHandler(SessionsController.getSessions));
router.get('/:id', asyncHandler(SessionsController.getSessionById));
router.put('/:id', asyncHandler(SessionsController.updateSession));
router.delete('/:id', asyncHandler(SessionsController.deleteSession));

export default router;
// UX/API extras úteis para o frontend (opcionais, muito úteis)
// Endpoint de disponibilidade (GET /api/barbeiros/:id/availability?data=...) que retorna horários livres por serviço/duração.
// Endpoint para buscar próximos agendamentos do dia/semana (agregação).
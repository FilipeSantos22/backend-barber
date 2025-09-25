/**
 * lembrar de seguir o padrão que está em docs\openapi.yaml
 */   
import { Router } from 'express';
import { asyncHandler } from '../middlewares/error';
import { UsuariosController } from '../controllers/usuarios.controller';


const router = Router();

router.get('/', asyncHandler(UsuariosController.listar));
router.get('/:id/agendamentos-barbeiro', asyncHandler(UsuariosController.listarAgendamentos));
router.get('/:id/agendamentos-cliente', asyncHandler(UsuariosController.listarAgendamentos));
router.get('/:id', asyncHandler(UsuariosController.buscarPorId));
// router.get('/', asyncHandler(UsuariosController.buscarPorEmail));
router.post("/login", UsuariosController.login);
router.post('/', asyncHandler(UsuariosController.criar));
router.put('/:id', asyncHandler(UsuariosController.atualizar));
router.delete('/:id', asyncHandler(UsuariosController.remover));
router.patch('/recuperar-senha', asyncHandler(UsuariosController.recuperarSenha));

export default router;

// UX/API extras úteis para o frontend (opcionais, muito úteis)
// Endpoint de disponibilidade (GET /api/barbeiros/:id/availability?data=...) que retorna horários livres por serviço/duração.
// Endpoint para buscar próximos agendamentos do dia/semana (agregação).
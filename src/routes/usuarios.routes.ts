/**
 * lembrar de seguir o padrão que está em docs\openapi.yaml
 */   
import { Router } from 'express';
import { asyncHandler } from '../middlewares/error';
import { UserController } from '../controllers/usuarios.controller';


const router = Router();

router.get('/', asyncHandler(UserController.findAll));
router.get('/:id', asyncHandler(UserController.findById));
router.post('/', asyncHandler(UserController.create));
router.put('/:id', asyncHandler(UserController.update));
router.delete('/:id', asyncHandler(UserController.deleteById));
router.patch('/:id/senha', asyncHandler(UserController.changePassword));

export default router;
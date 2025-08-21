import { Router } from 'express';
import { UserController } from '../controllers/usuarios.controller';

const router = Router();
router.get('/', UserController.listar);
router.post('/', UserController.criar);
export default router;
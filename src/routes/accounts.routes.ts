import { Router } from 'express';
import { asyncHandler } from '../middlewares/error';
import { AccountsController } from '../controllers/accounts.controller';

const router = Router();

router.post('/', asyncHandler(AccountsController.createAccount));
router.get('/', asyncHandler(AccountsController.getAccounts));
router.get('/:id', asyncHandler(AccountsController.getAccountById));
router.put('/:id', asyncHandler(AccountsController.updateAccount));
router.delete('/:id', asyncHandler(AccountsController.deleteAccount));

export default router;

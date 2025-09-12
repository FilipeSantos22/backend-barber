import { Router } from 'express';
import { asyncHandler } from '../middlewares/error';
import { VerificationTokensController } from '../controllers/verification_tokens.controller';

const router = Router();

router.post('/', asyncHandler(VerificationTokensController.createVerificationToken));
router.get('/', asyncHandler(VerificationTokensController.getVerificationTokens));
router.get('/:id', asyncHandler(VerificationTokensController.getVerificationTokenById));
router.put('/:id', asyncHandler(VerificationTokensController.updateVerificationToken));
router.delete('/:id', asyncHandler(VerificationTokensController.deleteVerificationToken));

export default router;
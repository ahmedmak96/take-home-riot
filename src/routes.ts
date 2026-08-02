import { Router } from 'express';
import { encryptionController } from './modules/encryption/encryption.controller';
import { signingController } from './modules/signing/signing.controller';

const router = Router();

router.post('/encrypt', encryptionController.encrypt);
router.post('/decrypt', encryptionController.decrypt);
router.post('/sign', signingController.sign);
router.post('/verify', signingController.verify);

export default router;

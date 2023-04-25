import { Router } from 'express';
import { userLogin } from '../controllers/auth.controller';

const router = Router();

router.post('/auth/pip/login', userLogin);

export default router;
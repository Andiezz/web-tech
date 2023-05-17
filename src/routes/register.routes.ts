import { requireLogin, requireRole, validateRequest } from '@pippip/pip-system-common';
import express from 'express';
import {
  confirmRegister,
  getRegisterDetail,
  getRegisterList,
  registerAgency,
  updateRegisterDetail,
} from '../controllers/register.controllers';
import {
  confirmRegisterValidator,
  createRegisterValidator,
  updateRegisterValidator,
} from '../middleware/register.validator';

const router = express.Router();

router.get(
  '/register',
  requireLogin,
  requireRole(['ADMIN', 'PM']),
  // queryRegisterListValidator,
  validateRequest,
  getRegisterList,
);
router.get(
  '/register/detail/:registerId',
  requireLogin,
  requireRole(['ADMIN', 'PM']),
  getRegisterDetail,
);
router.put(
  '/register/update_info/:registerId',
  requireLogin,
  requireRole(['ADMIN', 'PM']),
  updateRegisterValidator,
  validateRequest,
  updateRegisterDetail,
);

router.post(
  '/register/confirm/:registerId',
  requireLogin,
  requireRole(['ADMIN', 'PM']),
  confirmRegisterValidator,
  validateRequest,
  confirmRegister,
);

router.post('/register', createRegisterValidator, validateRequest, registerAgency);

export default router;

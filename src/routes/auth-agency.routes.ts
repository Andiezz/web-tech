import { validateRequest } from '@pippip/pip-system-common';
import { Router } from 'express';
import {
  agencyLogin,
  agencyLogout,
  refreshAgencyAccessToken,
} from '../controllers/auth-agency.controller';
import { requireLoginSession } from '../controllers/auth.controllers';
import { agencyLoginValidator, refreshTokenValidator } from '../middleware/auth.validator';

const router = Router();

router.post('/auth/pipcar/agency/login', agencyLoginValidator, validateRequest, agencyLogin);
router.get('/auth/pipcar/agency/logout', requireLoginSession, agencyLogout);
router.post(
  '/auth/pipcar/agency/refresh_token',
  refreshTokenValidator,
  validateRequest,
  refreshAgencyAccessToken,
);

export default router;

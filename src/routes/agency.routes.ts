import {
  requireAgencyLogin,
  requireAgencyRole,
  requireLogin,
  requireRole,
  validateRequest,
} from '@pippip/pip-system-common';
import express from 'express';
import {
  blockAgency,
  createAgency,
  getAgencyDetail,
  getAgencyList,
  profileAgency,
  unblockAgency,
  updateAgencyDetail,
  searchAgency,
  getPhone,
} from '../controllers/agency.controllers';
import { createAgencyValidator, updateAgencyValidator, searchAgencyValidator } from '../middleware/agency.validator';

const router = express.Router();

router.get('/agency/info', requireAgencyLogin, requireAgencyRole(['AGENCY']), profileAgency);

router.get(
  '/agency',
  requireLogin,
  requireRole(['ADMIN', 'PM']),
  // queryAgencyListValidator,
  validateRequest,
  getAgencyList,
);
router.get('/agency/detail/:agencyId', requireLogin, requireRole(['ADMIN', 'PM']), getAgencyDetail);

router.post(
  '/agency',
  requireLogin,
  requireRole(['ADMIN', 'PM']),
  createAgencyValidator,
  validateRequest,
  createAgency,
);
router.put(
  '/agency/update_info/:agencyId',
  requireLogin,
  requireRole(['ADMIN', 'PM']),
  updateAgencyValidator,
  validateRequest,
  updateAgencyDetail,
);

router.put('/agency/block/:agencyId', requireLogin, requireRole(['ADMIN', 'PM']), blockAgency);
router.put('/agency/unblock/:agencyId', requireLogin, requireRole(['ADMIN', 'PM']), unblockAgency);

router.get(
  '/agency/search', 
  requireAgencyLogin, 
  requireAgencyRole(['AGENCY']), 
  searchAgencyValidator, 
  searchAgency
);
router.get(
  '/agency/cash_get_phone', 
  requireAgencyLogin,
  requireAgencyRole(['AGENCY']), 
  getPhone
);

export default router;

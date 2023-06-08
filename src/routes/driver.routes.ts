import { requireLogin, requireRole, validateRequest } from '@pippip/pip-system-common';
import express from 'express';
import {
  createDriver,
  deleteDriver,
  deliverDriver,
  getDriverDetail,
  getDriverList,
  unDeliverDriver,
} from '../controllers/driver.controllers';
import { createDriverValidator } from '../middleware/driver.validator';

const router = express.Router();

router.get(
  '/driver',
  requireLogin,
  requireRole(['ADMIN', 'PM']),
  // queryDriverListValidator,
  validateRequest,
  getDriverList,
);
router.get('/driver/detail/:driverId', requireLogin, requireRole(['ADMIN', 'PM']), getDriverDetail);

router.post(
  '/driver',
  requireLogin,
  requireRole(['ADMIN', 'PM']),
  createDriverValidator,
  validateRequest,
  createDriver,
);
// router.put(
//   '/driver/update_info/:driverId',
//   requireLogin,
//   requireRole(['ADMIN', 'PM']),
//   // updateDriverValidator,
//   validateRequest,
//   updateDriverDetail,
// );
router.delete('/driver/:driverId', requireLogin, requireRole(['ADMIN', 'PM']), deleteDriver);
router.put('/driver/:driverId/deliver', requireLogin, requireRole(['ADMIN', 'PM']), deliverDriver);
router.put(
  '/driver/:driverId/undeliver',
  requireLogin,
  requireRole(['ADMIN', 'PM']),
  unDeliverDriver,
);

export default router;

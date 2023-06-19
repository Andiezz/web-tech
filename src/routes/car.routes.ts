import { requireLogin, requireRole, validateRequest } from '@pippip/pip-system-common';
import express from 'express';
import {
  createCar,
  deleteCar,
  getCarDetail,
  getCarList,
  unDeliverCar,
  updateCarGPS,
} from '../controllers/car.controllers';
import { createCarValidator, updateCarGPSValidator } from '../middleware/car.validator';

const router = express.Router();

router.get(
  '/car',
  requireLogin,
  requireRole(['ADMIN', 'PM']),
  // queryCarListValidator,
  validateRequest,
  getCarList,
);
router.get('/car/detail/:carId', requireLogin, requireRole(['ADMIN', 'PM']), getCarDetail);

router.post(
  '/car',
  requireLogin,
  requireRole(['ADMIN', 'PM']),
  createCarValidator,
  validateRequest,
  createCar,
);

router.delete('/car/:carId', requireLogin, requireRole(['ADMIN', 'PM']), deleteCar);
router.put('/car/:carId/undeliver', requireLogin, requireRole(['ADMIN', 'PM']), unDeliverCar);
// router.put(
//   '/car/update_info/:carId',
//   requireLogin,
//   requireRole(['ADMIN', 'PM']),
//   // updateCarValidator,
//   validateRequest,
//   updateCarDetail,
// );

router.put(
  '/car/update_gps_by_car_list',
  requireLogin,
  requireRole(['ADMIN', 'PM']),
  updateCarGPSValidator,
  validateRequest,
  updateCarGPS,
);

export default router;

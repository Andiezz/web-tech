import { body } from 'express-validator';

export const createCarValidator = [
  body('plates').exists().trim().withMessage('Plates is required'),
  body('car_type_id').isNumeric().withMessage('Invalid type'),
  body('name').exists({ checkFalsy: true }).withMessage('Name is required'),
  body('lat').isString().withMessage('Invalid lat type'),
  body('long').isString().withMessage('Invalid long type'),
];

export const updateCarGPSValidator = [
  body('lat').isString().withMessage('Invalid lat type'),
  body('long').isString().withMessage('Invalid long type'),
];

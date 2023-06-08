import { body } from 'express-validator';

export const createDriverValidator = [
  body('phone')
    .exists()
    .withMessage('Phone is required')
    .trim()
    .isMobilePhone(['vi-VN'])
    .withMessage('Invalid phone number'),
  body('name')
    .exists({ checkFalsy: true })
    .withMessage('Name is required')
    .isAlpha('vi-VN', { ignore: ' ' })
    .withMessage('Name must not contains special characters'),
  body('license_id')
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Invalid license_id type'),
  body('address').optional({ checkFalsy: true }).isString().withMessage('Invalid address type'),
  body('lat_address')
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Invalid lat_address type'),
  body('long_address')
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Invalid long_address type'),
  body('lat').optional({ checkFalsy: true }).isString().withMessage('Invalid lat type'),
  body('long').optional({ checkFalsy: true }).isString().withMessage('Invalid long type'),
  body('updated_gps_time')
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage('Invalid updated_gps_time type'),
];

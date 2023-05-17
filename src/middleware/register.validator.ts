import { body, query } from 'express-validator';

export const createRegisterValidator = [
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
  body('isTransportation').isBoolean().withMessage('Invalid isTransportation type'),
  body('isDriver').isBoolean().withMessage('Invalid isDriver type'),
  body('isAgency').optional().isBoolean().withMessage('Invalid isAgency type'),
  body('code')
    .optional()
    .trim()
    .isLength({ max: 6, min: 6 })
    .withMessage('Code must be equal 6 characters long')
    .isNumeric()
    .withMessage('Code must not contains special characters'),
];

export const updateRegisterValidator = [
  body('phone').optional().trim().isMobilePhone(['vi-VN']).withMessage('Invalid phone number'),
  body('name')
    .optional()
    .isAlpha('vi-VN', { ignore: ' ' })
    .withMessage('Name must not contains special characters'),
  body('isTransportation').optional().isBoolean().withMessage('Invalid isTransportation type'),
  body('isDriver').optional().isBoolean().withMessage('Invalid isDriver type'),
  body('isAgency').optional().isBoolean().withMessage('Invalid isAgency type'),
  body('code')
    .optional()
    .trim()
    .isLength({ max: 6, min: 6 })
    .withMessage('Code must be equal 6 characters long')
    .isNumeric()
    .withMessage('Code must not contains special characters'),
];

export const confirmRegisterValidator = [
  query('code').exists({ checkFalsy: true }).isString().withMessage('Invalid code type'),
];

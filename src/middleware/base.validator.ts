import { query } from 'express-validator';

export const queryFilterBaseValidator = [
  query('page').exists().withMessage(' is required'),
  query('limit').exists({ checkFalsy: true }).withMessage('Name is required'),
];

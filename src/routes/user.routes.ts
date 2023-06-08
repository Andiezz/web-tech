import { requireLogin, requireRole, validateRequest } from '@pippip/pip-system-common';
import express from 'express';
import {
  blockUser,
  createUser,
  deleteUser,
  getCurrentUserDetail,
  getUserDetail,
  getUserList,
  unblockUser,
  updateUserDetail,
} from '../controllers/user.controllers';
import { createUserValidator, updateUserValidator } from '../middleware/user.validator';

const router = express.Router();

router.post(
  '/auth/pip/user',
  requireLogin,
  requireRole(['ADMIN']),
  createUserValidator,
  validateRequest,
  createUser,
);

router.get(
  '/auth/pip/user',
  requireLogin,
  requireRole(['ADMIN']),
  // queryUserListValidator,
  validateRequest,
  getUserList,
);

router.get('/auth/pip/user/detail/:userId', requireLogin, requireRole(['ADMIN']), getUserDetail);

router.put(
  '/auth/pip/user/update_info/:userId',
  requireLogin,
  requireRole(['ADMIN']),
  updateUserValidator,
  validateRequest,
  updateUserDetail,
);

router.put('/auth/pip/user/block/:userId', requireLogin, requireRole(['ADMIN']), blockUser);
router.put('/auth/pip/user/unblock/:userId', requireLogin, requireRole(['ADMIN']), unblockUser);
router.delete('/auth/pip/user/delete/:userId', requireLogin, requireRole(['ADMIN']), deleteUser);

router.get('/auth/pip/user/me', requireLogin, requireRole(['ADMIN', 'PM']), getCurrentUserDetail);

export default router;

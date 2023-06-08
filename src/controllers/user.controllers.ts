import {
  BadRequestError,
  NotAuthenticateError,
  NotAuthorizedError,
  NotFoundError,
} from '@pippip/pip-system-common';
import { Request, Response } from 'express';
import _User from '../models/user.model';
import { convertToNumber, getTotalPage, hashPassword } from '../utils';

/**
 * [ADMIN] createUser
 * ADMIN tạo tài khoản User hệ thống (PM)
 */
export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { phone, name, password, role } = req.body;

  if (role === 'ADMIN') throw new BadRequestError('You cant register admin account');

  const foundUser = await _User.findOne({ phone, role });
  if (!!foundUser)
    throw new BadRequestError('This account is already registered, please pick a different one');

  const hashedPassword = await hashPassword(password);
  const newUser = await new _User({
    phone,
    name,
    password: hashedPassword,
    role,
  }).save();

  res.status(200).json({
    status: 1,
    message: 'New user created',
    data: { user_detail: newUser },
  });
};

/**
 * [ADMIN] getUserList
 * ADMIN lấy ra danh sách User hệ thống (PM), trừ ADMIN
 * TODO:
 * [x] - Phân trang, Tìm kiếm
 * [x] - Bộ lọc
 * [] - Sắp xếp
 */
export const getUserList = async (req: Request, res: Response): Promise<void> => {
  const { status, keyword, page, limit, sort } = req.query; // => all string

  let filter: any = { role: { $ne: 'ADMIN' } };

  if (status) {
    filter.status = status;
  }

  if (keyword) {
    const regex = new RegExp(`${keyword}`, 'i');
    const regexCond = { $regex: regex };
    console.log(regexCond);
    filter['$or'] = [{ name: regexCond }, { phone: regexCond }];
  }

  const currentPage = convertToNumber(page) || 1;

  const limitNumber = convertToNumber(limit) || 10;

  const totalUser = await _User.countDocuments(filter);

  const foundUserList = await _User
    .find(filter)
    .skip((currentPage - 1) * limitNumber)
    .limit(limitNumber)
    .sort([
      ['status', 1],
      ['updatedAt', -1],
    ]);

  res.status(200).json({
    status: 1,
    message: 'Get User List Successfully.',
    data: {
      user_list: foundUserList,
      meta_data: {
        page: currentPage,
        limit: limitNumber,
        total: totalUser,
        totalPage: getTotalPage(totalUser, limitNumber),
      },
    },
  });
};

/**
 * [ADMIN] getUserDetail
 */
export const getUserDetail = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  const foundUser = await _User.findOne({ $and: [{ _id: userId }, { role: { $ne: 'ADMIN' } }] });
  res.status(200).json({
    status: 1,
    message: 'Get User Profile Successfully.',
    data: {
      user_detail: foundUser,
    },
  });
};

/**
 * [ADMIN] updateUserDetail
 */
export const updateUserDetail = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  const { name, phone, password } = req.body;

  let newPassword;
  if (!!password) {
    newPassword = await hashPassword(password);
  }

  const updatedUser = await _User.findOneAndUpdate(
    { $and: [{ _id: userId }, { role: { $ne: 'ADMIN' } }] },
    { name, phone, password: newPassword, refresh_token: 'EMPTY' },
    { new: true, omitUndefined: true },
  );
  res.status(200).json({
    status: 1,
    message: 'Update User Successfully.',
  });
};

/**
 * [ADMIN] deleteUser
 */
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  const deletedUser = await _User.findOneAndDelete({
    $and: [{ _id: userId }, { role: { $ne: 'ADMIN' } }],
  });
  res.status(200).json({
    status: 1,
    message: 'Delete User Successfully.',
  });
};

/**
 * [ADMIN] blockUser
 */
export const blockUser = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  const updatedUser = await _User.findOneAndUpdate(
    { $and: [{ _id: userId }, { role: { $ne: 'ADMIN' } }] },
    { status: 2, refresh_token: 'EMPTY' },
    { new: true },
  );
  res.status(200).json({
    status: 1,
    message: 'Block User Successfully.',
  });
};

/**
 * [ADMIN] unblockUser
 */
export const unblockUser = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  const updatedUser = await _User.findOneAndUpdate(
    { $and: [{ _id: userId }, { role: { $ne: 'ADMIN' } }] },
    { status: 1, refresh_token: 'EMPTY' },
    { new: true },
  );
  res.status(200).json({
    status: 1,
    message: 'Unblock User Successfully.',
  });
};

/**
 * [ADMIN, PM] getCurrentUserDetail
 */
export const getCurrentUserDetail = async (req: Request, res: Response): Promise<void> => {
  if (req.currentUser == null) {
    req.session = null;
    throw new NotAuthenticateError('You are not authenticated.');
  }
  const foundUser = await _User.findById(req.currentUser.id);

  if (!foundUser) {
    req.session = null;
    throw new NotFoundError();
  }

  if (foundUser.toObject().refresh_token === 'EMPTY') {
    req.session = null;
    throw new NotAuthorizedError('You are not authorized.');
  }

  res.status(200).json({
    status: 1,
    message: 'Get User Info successful.',
    data: { user_detail: foundUser },
  });
};

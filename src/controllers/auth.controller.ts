import {
  BadRequestError,
  DataNotFoundError,
  NotAuthenticateError,
  UserPayload,
} from '@pippip/pip-system-common';
import { compare } from 'bcrypt';
import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import _User from '../models/user.model';
dotenv.config();

const signAccessToken = (payload: UserPayload) =>
  jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: process.env.ACCESS_TOKEN_EXP!,
  });
const signRefreshToken = (payload: UserPayload) =>
  jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: process.env.REFRESH_TOKEN_EXP!,
  });

export const userLogin = async (req: Request, res: Response): Promise<void> => {
  const { phone, password } = req.body;

  const foundUser = await _User.findOne({ phone });
  if (foundUser == null) throw new DataNotFoundError();
  if (foundUser.status === 2) throw new BadRequestError('Access Denied');

  const isEqual = await compare(password, foundUser.password);
  if (!isEqual) throw new BadRequestError('Wrong password');

  const { refresh_token: rt, password: pw, _id, ...restDataUser } = foundUser.toObject();
  const userPayload: UserPayload = {
    id: _id.toString(),
    ...restDataUser,
  };

  // generate a token and send to client
  const accessToken = signAccessToken(userPayload);
  const refreshToken = signRefreshToken(userPayload);

  await _User.findByIdAndUpdate(_id.toString(), { refresh_token: refreshToken }, { new: true });

  req.session = {
    user_access_token: accessToken,
  };

  req.currentUser = userPayload;

  res.status(200).json({
    status: 1,
    message: 'Login Successful',
    data: {
      refresh_token: refreshToken,
    },
  });
};
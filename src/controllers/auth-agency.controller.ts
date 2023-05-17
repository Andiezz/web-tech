import {
  AgencyPayload,
  BadRequestError,
} from '@pippip/pip-system-common';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import _Agency from '../models/agency.model';
import _User from '../models/user.model';
dotenv.config();

const signAgencyAccessToken = (payload: AgencyPayload) =>
  jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: process.env.ACCESS_TOKEN_EXP!, //? can replace with expiration shorter
  });
const signAgencyRefreshToken = (payload: AgencyPayload) =>
  jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: process.env.REFRESH_TOKEN_EXP!, //? can replace with expiration shorter
  });

/**
 * agencyLogin
 */
export const agencyLogin = async (req: Request, res: Response): Promise<void> => {
  const { phone, code } = req.body;
  const foundAgency = await _Agency.findOne({ phone: phone });

  if (!foundAgency) {
    throw new BadRequestError('Agency has not yet existed or been confirmed');
  }
  if (foundAgency.status !== 1) {
    throw new BadRequestError('Agency has not yet confirmed or has been blocked');
  }

  const check_code = foundAgency.code;
  if (check_code !== code) {
    throw new BadRequestError('Code does not match! Please ask the manager for more information');
  }

  const agencyData = await _Agency.aggregate([
    {
      $match: {
        phone: phone,
      },
    },
    {
      $replaceWith: {
        $setField: {
          field: 'id',
          input: '$$ROOT',
          value: { $toString: '$_id' },
        },
      },
    },
    {
      $unset: ['code', 'refresh_token', '_id'],
    },
  ]);
  const {
    id,
    phone: ph,
    name: nm,
    status: stt,
    rank: rk,
    isTransportation: iTr,
    isDriver: iDr,
    ...restDataAgency
  } = agencyData[0];

  const agencyPayload: AgencyPayload = {
    id: id,
    phone: ph,
    name: nm,
    role: 'AGENCY',
    status: stt,
    rank: rk,
    isTransportation: iTr,
    isDriver: iDr,
  };

  // generate a token and send to client
  const accessToken = signAgencyAccessToken(agencyPayload);
  const refreshToken = signAgencyRefreshToken(agencyPayload);

  await _Agency.findByIdAndUpdate(agencyPayload.id, { refresh_token: refreshToken }, { new: true });

  req.session = {
    agency_access_token: accessToken,
  };

  req.currentAgency = agencyPayload;

  res.status(200).json({
    status: 1,
    message: 'Login Successful',
    data: {
      refresh_token: refreshToken,
    },
  });
};

/**
 * agencyLogout
 */
export const agencyLogout = async (req: Request, res: Response): Promise<void> => {
  if (req.currentAgency != null)
    await _Agency.findByIdAndUpdate(
      req.currentAgency.id,
      {
        refresh_token: 'EMPTY',
      },
      { new: true },
    );

  req.currentAgency = null;
  req.session = null;
  res.status(200).json({
    status: 1,
    message: 'Logout successful.',
  });
};

export const refreshAgencyAccessToken = async (req: Request, res: Response): Promise<void> => {
  const { refresh_token: refreshToken } = req.body;

  const accessToken = await generateAgencyAT(refreshToken);

  if (accessToken == null) {
    req.session = null;
    req.currentAgency = null;
    throw new BadRequestError('Invalid Refresh Token.');
  }
  req.session = {
    agency_access_token: accessToken,
  };
  res.status(200).json({
    status: 1,
    message: 'Refresh Token successful.',
  });
};

async function generateAgencyAT(refreshToken: string): Promise<string | null> {
  const checkRT = await _Agency.exists({ refresh_token: refreshToken });
  if (checkRT == null) return null;

  const foundAgency = await _Agency.aggregate([
    {
      $match: {
        _id: checkRT._id,
      },
    },
    {
      $replaceWith: {
        $setField: {
          field: 'id',
          input: '$$ROOT',
          value: { $toString: '$_id' },
        },
      },
    },
    {
      $unset: ['code', 'refresh_token', '_id'],
    },
  ]);

  if (foundAgency.length == 0) return null;

  const {
    id,
    phone: ph,
    name: nm,
    status: stt,
    rank: rk,
    isTransportation: iTr,
    isDriver: iDr,
    ...restDataAgency
  } = foundAgency[0];

  const agencyPayload: AgencyPayload = {
    id: id,
    phone: ph,
    name: nm,
    role: 'AGENCY',
    status: stt,
    rank: rk,
    isTransportation: iTr,
    isDriver: iDr,
  };

  const accessToken = signAgencyAccessToken(agencyPayload);

  return accessToken;
}

import {
  BadRequestError,
  DataNotFoundError,
  NotAuthenticateError,
  NotAuthorizedError,
  NotFoundError,
} from '@pippip/pip-system-common';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import _Agency, { TAgency } from '../models/agency.model';
import _Car from '../models/car.model';
import _Driver from '../models/driver.model';
import _Register, { TRegister } from '../models/register.model';
import { convertToNumber, getRandomInt, getTotalPage } from '../utils';

/**
 * [ADMIN,PM] getAgencyList
 * TODO:
 * [x] - Phân trang, Tìm kiếm
 * [] - Bộ lọc (status, ....)
 * [] - Sắp xếp
 */
export const getAgencyList = async (req: Request, res: Response): Promise<void> => {
  const { status, keyword, page, limit, isTransportation, isDriver, hasCar, sort } = req.query; // => all string
  let filter: any = {};

  if (status) {
    filter.status = status;
  }

  if (keyword) {
    const regex = new RegExp(`${keyword}`, 'i');
    const regexCond = { $regex: regex };
    console.log(regexCond);
    filter['$or'] = [{ name: regexCond }, { phone: regexCond }];
  }

  if (isTransportation) {
    filter.isTransportation = isTransportation;
  }

  if (isDriver) {
    filter.isDriver = isDriver;
  }

  if (hasCar) {
    filter.hasCar = { $gte: convertToNumber(hasCar) };
  }

  const currentPage = convertToNumber(page) || 1;

  const limitNumber = convertToNumber(limit) || 10;

  const totalAgency = await _Agency.countDocuments(filter);

  const foundAgencyList = await _Agency
    .find(filter)
    .skip((currentPage - 1) * limitNumber)
    .limit(limitNumber)
    .sort([
      ['status', 1],
      ['updatedAt', -1],
    ]);

  res.status(200).json({
    status: 1,
    message: 'Get Agency List Successfully.',
    data: {
      agency_list: foundAgencyList,
      meta_data: {
        page: currentPage,
        limit: limitNumber,
        total: totalAgency,
        totalPage: getTotalPage(totalAgency, limitNumber),
      },
    },
  });
};

/**
 * [ADMIN,PM] getAgencyDetail
 */
export const getAgencyDetail = async (req: Request, res: Response): Promise<void> => {
  const { agencyId } = req.params;
  const foundAgency = await _Agency.findById(agencyId);
  res.status(200).json({
    status: 1,
    message: 'Get Agency Profile Successfully.',
    data: {
      agency_detail: foundAgency,
    },
  });
};

/**
 * [ADMIN,PM] updateAgencyDetail
 */
export const updateAgencyDetail = async (req: Request, res: Response): Promise<void> => {
  const { agencyId } = req.params;
  // const {name,phone,address,isDriver,isTransportation,lat,lat_address,long,long_address,point,rank,updated_gps_time,status} = req.body;
  const {
    hasCar,
    refresh_token,
    code,
    phone,
    name,
    address,
    isDriver,
    isTransportation,
    lat_address,
    long_address,
    point,
    rank,
    status,
  } = req.body;

  const foundAgency = await _Agency.findById(agencyId);
  if (!foundAgency) throw new DataNotFoundError();

  const checkPhone = await _Agency.findOne({ phone: phone });
  if (checkPhone && foundAgency.phone !== phone) {
    throw new BadRequestError('This phone has already been in use');
  }

  let newData = {
    code,
    phone,
    name,
    address,
    isDriver,
    isTransportation,
    lat_address,
    long_address,
    point,
    rank,
    status,
  };
  // if (isDriver) {
  //   await checkDriver(agencyId, phone, name, status);
  // } else {
  //   await _Driver.findOneAndDelete({ agency_id: agencyId });
  // }
  if (!!code && foundAgency.code !== code) {
    newData.code = code;
    const updatedAgency = await _Agency.findByIdAndUpdate(
      agencyId,
      { ...newData, refresh_token: 'EMPTY' },
      {
        new: true,
        omitUndefined: true,
      },
    );
  } else {
    const updatedAgency = await _Agency.findByIdAndUpdate(agencyId, newData, {
      new: true,
      omitUndefined: true,
    });
  }

  res.status(200).json({
    status: 1,
    message: 'Update Agency Profile Successfully.',
  });
};

/**
 * [ADMIN,PM] createAgency
 */
export const createAgency = async (req: Request, res: Response): Promise<void> => {
  const generatedCode = getRandomInt().toString();
  const {
    code,
    name,
    phone,
    address,
    isDriver,
    isTransportation,
    lat_address,
    long_address,
    point,
    rank,
  } = req.body;

  const foundAgency: TAgency = (await _Agency.findOne({ phone })) as TAgency;
  if (!!foundAgency) throw new BadRequestError('This account is already registered');

  const registerData: TRegister = {
    code: generatedCode,
    phone,
    name,
    status: 1,
    isAgency: true,
    isDriver,
    isTransportation,
  };

  const foundRegister = await _Register.findOne({ phone });
  if (!foundRegister) {
    await new _Register(registerData).save();
  } else {
    await _Register.findOneAndUpdate({ phone }, registerData, { new: true, omitUndefined: true });
  }

  const newAgency = await new _Agency({
    code: generatedCode,
    name,
    phone,
    address,
    isDriver,
    isTransportation,
    lat_address,
    long_address,
    point,
    rank,
    status: 1,
  }).save();

  // if (isDriver) {
  //   await checkDriver(newAgency._id.toString(), phone, name, 1);
  // }

  res.status(200).json({
    status: 1,
    message: 'New agency created',
  });
};

/**
 * [ADMIN,PM] blockAgency
 */
export const blockAgency = async (req: Request, res: Response): Promise<void> => {
  const { agencyId } = req.params;
  const updatedAgency = await _Agency.findByIdAndUpdate(
    agencyId,
    { status: 2, refresh_token: 'EMPTY' },
    { new: true },
  );
  res.status(200).json({
    status: 1,
    message: 'Block Agency Successfully.',
  });
};

/**
 * [ADMIN,PM] unblockAgency
 */
export const unblockAgency = async (req: Request, res: Response): Promise<void> => {
  const { agencyId } = req.params;
  const updatedAgency = await _Agency.findByIdAndUpdate(agencyId, { status: 1 }, { new: true });
  res.status(200).json({
    status: 1,
    message: 'Unblock Agency Successfully.',
  });
};

/**
 * [AGENCY] profileAgency
 */
export const profileAgency = async (req: Request, res: Response): Promise<void> => {
  if (req.currentAgency == null) {
    req.session = null;
    throw new NotAuthenticateError('You are not authenticated.');
  }
  const foundAgency = await _Agency.findById(req.currentAgency!.id);

  if (!foundAgency) {
    req.session = null;
    throw new NotFoundError();
  }

  if (foundAgency.toObject().refresh_token === 'EMPTY') {
    req.session = null;
    throw new NotAuthorizedError('You are not authorized.');
  }

  res.status(200).json({
    status: 1,
    message: 'Get Agency Info successful.',
    data: { agency_info: foundAgency },
  });
};

export const searchAgency = async (req: Request, res: Response): Promise<void> => {
  const { car_type_id } = req.query;

  const cars = await _Car.find({ car_type_id: car_type_id }).populate({
    path: 'agency_id',
    select: 'rank',
  });

  const agency_search_list = cars.map((car) => {
    const agency: Partial<TAgency> = car.agency_id as Partial<TAgency>;
    return {
      rank: agency.rank,
      car_name: car.name,
      car_plates: car.plates,
      agency_id: agency,
      car_id: car._id.toString(),
    };
  });

  agency_search_list.sort((a, b) => b.rank! - a.rank!);

  res.status(200).json({
    status: 1,
    message: 'Search Agency successful',
    data: { agency_search_list },
  });
};

export const getPhone = async (req: Request, res: Response): Promise<void> => {
  const { agency_id, car_id } = req.query;

  const car = await _Car
    .findOne({
      agency_id: agency_id,
      _id: new ObjectId(car_id?.toString()),
    })
    .populate({ path: 'agency_id', select: 'phone name' });
  if (!car) {
    throw new BadRequestError('Car does not exist');
  }

  const agency: Partial<TAgency> = car.agency_id as Partial<TAgency>;

  const currentAgencyId = req.currentAgency?.id;
  const currentAgency = await _Agency.findById(currentAgencyId);
  if (currentAgency!.point! < 1) {
    throw new BadRequestError('Point is not enough, please recharge');
  }

  currentAgency!.point!--;
  await currentAgency!.save();

  res.status(200).json({
    status: 1,
    message: 'Get phone successful',
    data: {
      phone: agency.phone,
      agency_name: agency.name,
      car_type: car.type,
      car_name: car.name,
      car_plate: car.plates,
    },
  });
};

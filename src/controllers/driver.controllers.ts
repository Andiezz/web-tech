import { BadRequestError, DataNotFoundError } from '@pippip/pip-system-common';
import { Request, Response } from 'express';
import _Agency from '../models/agency.model';
import _Car from '../models/car.model';
import _Driver from '../models/driver.model';
import _Register from '../models/register.model';
import { convertToNumber, getRandomInt } from '../utils';

/**
 * [ADMIN,PM] createDriver
 */
export const createDriver = async (req: Request, res: Response): Promise<void> => {
  const { agency: agencyId } = req.query;
  const { phone, name, license_id, address, lat_address, long_address, lat, long, status, code } =
    req.body;

  // const foundDriver = await _Driver.findOne({ phone });
  // if (!!foundDriver) throw new BadRequestError('This driver is already registered');

  // tạo register đã xác nhận + agency + gen code

  const generatedCode = getRandomInt().toString();

  const newDriver = new _Driver({
    phone,
    name,
    license_id,
    status: 1,
    address,
    lat_address,
    long_address,
    lat,
    long,
    car_id: null,
    agency_id: null,
  });

  const newRegister = new _Register({
    code: generatedCode,
    phone,
    name,
    status: 1,
    isAgency: true,
    isDriver: true,
    isTransportation: false,
  });

  const newAgency = new _Agency({
    name,
    code: generatedCode,
    phone,
    address,
    hasCar: 0,
    isDriver: true,
    isTransportation: false,
    lat_address,
    long_address,
    status: 1,
  });

  const foundDriverByAgencyAndPhone = await _Driver.findOne({
    $and: [{ phone }, { agency_id: agencyId }],
  });
  if (!!foundDriverByAgencyAndPhone) throw new BadRequestError('Driver was registered with agency');

  const foundAgency = await _Agency.findById(agencyId);
  if (!!foundAgency) {
    newDriver.agency_id = foundAgency._id;
    await newDriver.save();
  } else {
    await newRegister.save();

    await newAgency.save();

    newDriver.agency_id = newAgency._id;
    await newDriver.save();
  }

  res.status(200).json({
    status: 1,
    message: 'Create Driver Successfully.',
    data: {
      driver_detail: newDriver.toObject(),
    },
  });
};

/**
 * [ADMIN,PM] getDriverList
 * TODO:
 * [x] - Phân trang, Tìm kiếm
 * [x] - Bộ lọc
 * [] - Sắp xếp
 */
export const getDriverList = async (req: Request, res: Response): Promise<void> => {
  const { agency: agencyId, isDriving, keyword, page, limit, sort } = req.query; // => all string | undefined
  let filter: any = {};

  if (!!agencyId) filter.agency_id = agencyId;

  if (!!keyword) {
    const regex = new RegExp(`${keyword}`, 'i');
    const regexCond = { $regex: regex };
    console.log(regexCond);
    filter['$or'] = [{ name: regexCond }, { phone: regexCond }, { license_id: regexCond }];
  }

  if (!!isDriving) {
    if (isDriving === 'true') filter.car_id = { ['$ne']: null };
    if (isDriving === 'false') filter.car_id = { ['$eq']: null };
  }

  const currentPage = convertToNumber(page) || 1;

  const limitNumber = convertToNumber(limit) || 10;

  const totalRegister = await _Driver.countDocuments(filter);

  const foundDriverList = await _Driver
    .find(filter)
    .sort([
      ['status', 1],
      ['updatedAt', -1],
    ])
    .populate('car_id', '_id name plates type');

  res.status(200).json({
    status: 1,
    message: 'Get Driver List Successfully.',
    data: {
      driver_list: foundDriverList,
      meta_data: {
        page: 1,
        limit: totalRegister,
        total: totalRegister,
        totalPage: 1,
      },
    },
  });
};

/**
 * [ADMIN,PM] getDriverDetail
 */
export const getDriverDetail = async (req: Request, res: Response): Promise<void> => {
  const { driverId } = req.params;
  const foundDriver = await _Driver.findById(driverId).populate('car_id', '_id name plates type');
  res.status(200).json({
    status: 1,
    message: 'Get Driver Profile Successfully.',
    data: { driver_detail: foundDriver },
  });
};

/**
 * [ADMIN,PM] updateDriverDetail
 */
export const updateDriverDetail = async (req: Request, res: Response): Promise<void> => {
  const { driverId } = req.params;
  const {
    phone,
    name,
    license_id,
    status,
    rank,
    address,
    lat_address,
    long_address,
    lat,
    long,
    updated_gps_time,
  } = req.body;
  const updatedDriver = await _Driver.findByIdAndUpdate(
    driverId,
    {
      phone,
      name,
      license_id,
      status,
      rank,
      address,
      lat_address,
      long_address,
      lat,
      long,
      updated_gps_time,
    },
    {
      new: true,
      omitUndefined: true,
    },
  );
  res.status(200).json({
    status: 1,
    message: 'Update Driver Profile Successfully.',
    data: { driver_detail: updatedDriver },
  });
};

/**
 * [ADMIN, PM] deleteDriver
 */
export const deleteDriver = async (req: Request, res: Response): Promise<void> => {
  const { driverId } = req.params;
  const deletedDriver = await _Driver.findByIdAndDelete(driverId);
  res.status(200).json({
    status: 1,
    message: 'Delete Driver Successfully.',
    data: { driver_detail: deletedDriver },
  });
};

/**
 * [ADMIN,PM] deliverDriver
 */
export const deliverDriver = async (req: Request, res: Response): Promise<void> => {
  const { driverId } = req.params;
  const { car: carId } = req.query;

  const foundDriver = await _Driver.findById(driverId);
  if (!foundDriver) throw new DataNotFoundError();

  if (!!foundDriver.car_id && foundDriver.car_id.toString() === carId)
    throw new BadRequestError('Car has been delivered');

  const foundCar = await _Car.findById(carId);
  if (!foundCar) throw new DataNotFoundError();

  const updatedOldDriver = await _Driver.findOneAndUpdate(
    { car_id: carId },
    { car_id: null },
    { new: true, omitUndefined: true },
  );

  const updatedDriver = await _Driver.findByIdAndUpdate(
    driverId,
    { car_id: foundCar._id },
    { new: true, omitUndefined: true },
  );
  res.status(200).json({
    status: 1,
    message: 'Deliver Driver Successfully.',
    data: { driver_detail: updatedDriver },
  });
};

/**
 * [ADMIN,PM] unDeliverDriver
 */
export const unDeliverDriver = async (req: Request, res: Response): Promise<void> => {
  const { driverId } = req.params;

  const updatedDriver = await _Driver.findByIdAndUpdate(
    driverId,
    { car_id: null },
    { new: true, omitUndefined: true },
  );
  res.status(200).json({
    status: 1,
    message: 'unDeliver Driver Successfully.',
    data: { driver_detail: updatedDriver },
  });
};

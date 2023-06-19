import { Request, Response } from 'express';
import _CarType from '../models/car-type.model';

/**
 * car_typeList
 */
export const carTypeList = async (req: Request, res: Response): Promise<void> => {
  const carTypes = await _CarType
    .aggregate([
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
        $unset: ['_id'],
      },
    ])
    .sort({ name_id: 1 });

  res.status(200).json({
    status: 1,
    message: 'Get Car Type List Successfully.',
    data: { car_types: carTypes },
  });
};

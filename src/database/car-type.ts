import mongoose from 'mongoose';
import _CarType, { TCarType } from '../models/car-type.model';

type TObjectId = mongoose.Types.ObjectId;

export const carTypeSeeder = async (): Promise<TObjectId[]> => {
  await _CarType
    .deleteMany()
    .then(() => {
      console.log('PipCar Car Type is Cleared');
    })
    .catch((error) => {
      console.log(error);
    });

  const data: TCarType[] = [
    {
      name: '5 chỗ',
      name_id: 1,
    },
    {
      name: '7 chỗ',
      name_id: 2,
    },
    {
      name: '16 chỗ',
      name_id: 3,
    },
    {
      name: '29 chỗ thân dài',
      name_id: 4,
    },
    {
      name: '35 chỗ',
      name_id: 5,
    },
    {
      name: '45 chỗ',
      name_id: 6,
    },
    {
      name: 'Limousine 9 chỗ',
      name_id: 7,
    },
  ];

  let newCarTypes: TObjectId[] = [];

  data.forEach(async (item) => {
    await _CarType
      .deleteOne({ name_id: item.name_id })
      .then(() => {
        console.log(`[REMOVE]---CarType:${item.name}`);
      })
      .catch((error) => {
        console.log(error);
      });
    const newCarType = new _CarType(item);
    newCarTypes.push(newCarType.toObject()._id);
    await newCarType.save();
    console.log(`[ADD]---CarType:${item.name}`);
  });
  return newCarTypes;
};

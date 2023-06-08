import mongoose from 'mongoose';

export type TNameId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type TCarType = {
  name: string;
  name_id: TNameId;
};

const car_typeSchema = new mongoose.Schema<TCarType>(
  {
    name: { type: String, required: true },
    name_id: { type: Number, required: true, unique: true },
  },
  { timestamps: true },
);

const _CarType = mongoose.model<TCarType>('Car_Type', car_typeSchema);
export default _CarType;

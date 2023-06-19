import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;
import { TNameId } from './car-type.model';
type TObjectId = mongoose.Types.ObjectId;

export type TCar = {
  agency_id: TObjectId;
  plates: string;
  type: string;
  car_type_id: TNameId;
  name: string;
  lat?: string;
  long?: string;
  updated_gps_time?: number;
};

const carSchema = new mongoose.Schema<TCar>(
  {
    agency_id: { type: ObjectId, ref: 'Agency' },
    plates: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    car_type_id: { type: Number, required: true },
    name: { type: String, required: true },
    lat: { type: String, required: true },
    long: { type: String, required: true },
    updated_gps_time: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  },
);

const _Car = mongoose.model<TCar>('Car', carSchema);
export default _Car;

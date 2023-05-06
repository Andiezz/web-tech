import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;
type TObjectId = mongoose.Types.ObjectId;

export type TDriver = {
  agency_id: TObjectId;
  car_id: TObjectId;
  phone: string;
  license_id: string;
  name: string;

  status?: number;
  rank?: number;

  address?: string;
  lat_address?: string;
  long_address?: string;
  lat?: string;
  long?: string;
  updated_gps_time?: number;
};

const driverSchema = new mongoose.Schema<TDriver>(
  {
    agency_id: { type: ObjectId, ref: 'Agency' },
    car_id: { type: ObjectId, ref: 'Car' },
    phone: { type: String, required: true },
    license_id: { type: String },
    name: { type: String, required: true },

    status: { type: Number, required: true, default: 0 },
    rank: { type: Number, required: true, default: 0 },

    address: { type: String, default: '' },
    lat_address: { type: String, required: true },
    long_address: { type: String, required: true },
    lat: { type: String, required: true },
    long: { type: String, required: true },
    updated_gps_time: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  },
);

const _Driver = mongoose.model<TDriver>('Driver', driverSchema);
export default _Driver;

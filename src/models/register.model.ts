import mongoose from 'mongoose';

export type TRegister = {
  phone: string;
  name: string;
  code: string;
  status?: number;

  isTransportation?: boolean;
  isDriver?: boolean;
  isAgency?: boolean;
};

const RegisterSchema = new mongoose.Schema<TRegister>(
  {
    phone: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    code: { type: String, required: true },
    status: { type: Number, required: true, default: 0 },

    isTransportation: { type: Boolean, require: true, default: false },
    isAgency: { type: Boolean, require: true, default: false },
    isDriver: { type: Boolean, require: true, default: false },
  },
  {
    timestamps: true,
  },
);

const _Register = mongoose.model<TRegister>('Register', RegisterSchema);
export default _Register;

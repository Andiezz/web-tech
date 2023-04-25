import { model, Schema } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export interface TUser {
  phone: string;
  name: string;
  role: string;
  status: number;

  refresh_token?: string;
  password: string;
}

const userSchema = new Schema<TUser>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true, min: 8 },
    role: { type: String, required: true, enum: ['ADMIN', 'PM'] },
    status: { type: Number, required: true, default: 1 },
    refresh_token: { type: String, default: 'EMPTY' },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.refresh_token;
      },
    },
  },
);

userSchema.plugin(updateIfCurrentPlugin);

const _User = model<TUser>('User', userSchema);

userSchema.statics.build = (props: TUser) => {
  return new _User(props);
};

export default _User;

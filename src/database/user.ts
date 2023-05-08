import _User from '../models/user.model';
import { hashPassword } from '../utils';

export const UserSeeder = async (): Promise<void> => {
  const data = [
    {
      phone: '0965670347',
      name: 'Thành An ADMIN',
      password: '1234567890',
      role: 'ADMIN',
      status: 1,
    },
    {
      phone: '0969559556',
      name: 'Thành An PM',
      password: '1234567890',
      role: 'PM',
      status: 1,
    },
  ];

  data.forEach(async ({ password, ...item }) => {
    await _User
      .deleteOne({ phone: item.phone })
      .then(() => {
        console.log(`[REMOVE]---User:${item.role}:${item.phone}`);
      })
      .catch((error) => {
        console.log(error);
      });
    const encryptedPassword = await hashPassword(password);
    await new _User({
      ...item,
      password: encryptedPassword,
    }).save();
    console.log(`[ADD]---User:${item.role}:${item.phone}`);
  });
};

import { genSaltSync, hash } from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = genSaltSync();
  const hashedPassword = await hash(password, salt);
  return hashedPassword;
};

export const getRandomInt = (min = 100000, max = 999999) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

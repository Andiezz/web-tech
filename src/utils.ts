import { genSaltSync, hash } from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = genSaltSync();
  const hashedPassword = await hash(password, salt);
  return hashedPassword;
};

export const convertToNumber = (value: unknown): number =>
  Number.isNaN(Number(value)) ? 0 : Number(value);

export const getTotalPage = (total: number, limit: number) => {
  let totalPage =
    total % limit === 0 ? (total - (total % limit)) / limit : (total - (total % limit)) / limit + 1;
  totalPage = Number.isNaN(Number(totalPage)) ? 0 : Number(totalPage);
  return totalPage === 0 ? 1 : totalPage;
};

export const getRandomInt = (min = 100000, max = 999999) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

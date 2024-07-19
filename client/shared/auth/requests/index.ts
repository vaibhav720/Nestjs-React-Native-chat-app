import { baseUrl, get, post } from '../../request';
import {
  ICredentials,
  ILoginUser,
  IRegisterUser,
  IUserDetails,
} from '../interfaces/UserDetails';

export const getUsers = async (): Promise<IUserDetails[]> => {
  const { data: users } = await get<IUserDetails[]>(`${baseUrl}/auth`);
  return users;
};

export const register = async (
  newUser: IRegisterUser,
): Promise<IUserDetails> => {
  const { data: user } = await post<IUserDetails>(
    `${baseUrl}/auth/register`,
    newUser,
  );
  return user;
};

export const login = async (loginUser: ILoginUser): Promise<ICredentials> => {
  const { data: credentials } = await post<ICredentials>(
    `${baseUrl}/auth/login`,
    loginUser,
  );
  return credentials;
};

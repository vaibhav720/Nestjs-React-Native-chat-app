export interface IUserDetails {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface IRegisterUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IJwt {
  token: string;
}

export interface ICredentials extends IJwt {
  user: IUserDetails;
}

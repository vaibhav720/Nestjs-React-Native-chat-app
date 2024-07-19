import { FriendRequestEntity, UserEntity } from '@app/shared';
import { LoginUserDTO } from '../dtos/login-user.dto';
import { NewUserDTO } from '../dtos/new-user.dto';
import { UserJwt } from './user-jwt.interface';

export interface AuthServiceInterface {
  getUsers(): Promise<UserEntity[]>;
  findByEmail(email: string): Promise<UserEntity>;
  findById(id: number): Promise<UserEntity>;
  hashPassword(password: string): Promise<string>;
  register(newUser: Readonly<NewUserDTO>): Promise<UserEntity>;
  doesPasswordMatch(password: string, hashedPassword: string): Promise<boolean>;
  validateUser(email: string, password: string): Promise<UserEntity>;
  login(
    loginUser: Readonly<LoginUserDTO>,
  ): Promise<{ token: string; user: UserEntity }>;
  verifyJwt(jwt: string): Promise<{ user: UserEntity; exp: number }>;
  decodeJwt(jwt: string): Promise<UserJwt>;
  addFriend(userId: number, friendId: number): Promise<FriendRequestEntity>;
  getFriends(userId: number): Promise<FriendRequestEntity[]>;
}

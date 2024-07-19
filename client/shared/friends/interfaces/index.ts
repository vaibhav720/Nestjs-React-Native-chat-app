import { IUserDetails } from '../../auth/interfaces/UserDetails';

export interface IActiveFriend extends IUserDetails {
  isActive: boolean;
}

export interface IFriendRequest {
  id: number;
  creator: IUserDetails;
  receiver: IUserDetails;
}

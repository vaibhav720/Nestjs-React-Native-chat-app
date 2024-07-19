import {
  ILoginUser,
  IUserDetails,
} from '../shared/auth/interfaces/UserDetails';
import { IActiveFriend } from '../shared/friends/interfaces';

export interface INavRoutes {
  key: string;
  title: string;
  focusedIcon: string;
}

/**
 * Auth Context Props
 */
export interface IAuthContext {
  userDetails?: IUserDetails;
  jwt?: string;
  isLoggedIn: boolean;
  isLoggingIn: boolean;
  isActive: boolean;
  onLogin: (loginUser: ILoginUser) => void;
  onLogout: () => void;
}

/**
 * Friends Context Props
 */
export interface IFriendsContext {
  friends: IActiveFriend[];
  friend: IActiveFriend;
  setFriend: (friend: IActiveFriend) => void;
  isLoading: boolean;
}

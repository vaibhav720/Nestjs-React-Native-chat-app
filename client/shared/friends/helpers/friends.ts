import { IUserDetails } from '../../auth/interfaces/UserDetails';
import { IFriendRequest } from '../interfaces';

/**
 * Get Friends Util Function
 */
export const getFriends = (
  friendRequests: IFriendRequest[],
  userId: number,
) => {
  const friends = friendRequests.map((friendRequest) => {
    const isUserCreator = userId === friendRequest.creator.id;
    const friendDetails = isUserCreator
      ? friendRequest.receiver
      : friendRequest.creator;

    const { id, firstName, lastName, email } = friendDetails;
    return {
      id,
      email,
      firstName,
      lastName,
    } as IUserDetails;
  });

  return friends;
};

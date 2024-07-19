import { baseUrl, get } from '../../request';
import { IFriendRequest } from '../interfaces';

export const getFriendRequests = async () => {
  const { data: friendRequests } = await get<IFriendRequest[]>(
    `${baseUrl}/get-friends`,
  );
  return friendRequests;
};

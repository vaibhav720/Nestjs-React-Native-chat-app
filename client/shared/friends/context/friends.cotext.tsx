import { useQuery } from '@tanstack/react-query';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import SocketIOClient from 'socket.io-client';
import { IFriendsContext } from '../../../types';
import { AuthContext } from '../../auth/context/auth.context';
import { IUserDetails } from '../../auth/interfaces/UserDetails';
import { getFriends } from '../helpers/friends';
import { IActiveFriend } from '../interfaces';
import { getFriendRequests } from '../requests';

export const FriendsContext = createContext<IFriendsContext>({
  friends: [],
  friend: {} as IActiveFriend,
  setFriend: () => null,
  isLoading: false,
});

const baseUrl = 'http://localhost:3000';

export const FriendsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isActive, jwt, isLoggedIn, userDetails } = useContext(AuthContext);
  const [friend, setFriend] = useState<IActiveFriend>({} as IActiveFriend);
  const [friends, setFriends] = useState<IActiveFriend[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useQuery(
    ['friendRequests'],
    async () => {
      setIsLoading(true);
      const friendRequests = await getFriendRequests();
      console.log('friendRequests', friendRequests);
      const _friends = getFriends(
        friendRequests,
        (userDetails as IUserDetails).id!,
      );

      const activeFriends: IActiveFriend[] = _friends.map((f) => ({
        ...f,
        isActive: false,
      }));

      setFriends(activeFriends);

      return _friends;
    },
    {
      enabled: isLoggedIn,
      onSettled: () => {
        setIsLoading(false);
      },
    },
  );

  const socket = useMemo(
    () =>
      SocketIOClient(baseUrl, {
        transportOptions: {
          polling: {
            extraHeaders: {
              Authorization: jwt,
            },
          },
        },
      }),
    [jwt, baseUrl],
  );

  useEffect(() => {
    socket.emit('updateActiveStatus', isActive);

    socket.on(
      'friendActive',
      ({ id, isActive: isFriendActive }: { id: number; isActive: boolean }) => {
        setFriends((prev) => {
          if (userDetails?.id === id) return prev;

          const updateFriends = [...prev];
          const activeFriend = updateFriends.find((f) => f.id === id);

          if (!activeFriend) return prev;

          activeFriend.isActive = isFriendActive;

          return updateFriends;
        });
      },
    );

    return () => {
      socket.emit('updateActiveStatus', false);
      socket.off('friendActive');
    };
  }, [socket, isActive, userDetails]);

  return (
    <FriendsContext.Provider
      value={{
        friends,
        friend,
        setFriend,
        isLoading,
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
};

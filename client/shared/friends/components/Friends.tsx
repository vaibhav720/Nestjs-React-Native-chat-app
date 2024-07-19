import { View, Text } from 'react-native';
import React, { useContext } from 'react';
import { FriendsContext } from '../context/friends.cotext';
import { AuthContext } from '../../auth/context/auth.context';
import Loader from '../../components/Loader';
import Friend from './Friend';
import { Button } from 'react-native-paper';

interface IFriends {
  showMessage?: boolean;
}

const Friends = ({ showMessage = false }: IFriends) => {
  const { onLogout } = useContext(AuthContext);
  const { friends, isLoading } = useContext(FriendsContext);

  if (isLoading) {
    return <Loader dark />;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {friends?.length > 0 ? (
        friends?.map((fri) => (
          <Friend key={fri.id} friend={fri} showMessage={showMessage} />
        ))
      ) : (
        <Text>No friend</Text>
      )}

      {showMessage && <Button onPress={onLogout}>Sign out</Button>}
    </View>
  );
};

export default Friends;

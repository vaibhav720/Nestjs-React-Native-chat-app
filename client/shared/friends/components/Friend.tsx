import { View, Text, Pressable } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { IActiveFriend } from '../interfaces';
import { FriendsContext } from '../context/friends.cotext';
import { useNavigate } from 'react-router-native';
import { styles } from './styles';
import { Avatar } from 'react-native-paper';
import { COLOR_ONLINE_GREEN } from '../../constants/colors';

interface IFriend {
  friend: IActiveFriend;
  showMessage?: boolean;
}

const Friend = ({ friend, showMessage }: IFriend) => {
  const navigate = useNavigate();
  const { id, firstName, lastName, isActive } = friend;
  // const { setFriend } = useContext(FriendsContext);

  // useEffect(() => {
  //   setFriend(friend);
  // }, [friend, isActive, setFriend]);

  return (
    <Pressable
      key={friend.id}
      onPress={() => {
        navigate(`/chat/${id}`);
      }}
    >
      <View style={styles.friend}>
        <Avatar.Image
          size={72}
          style={styles.profilePicture}
          source={{
            uri: `https://randomuser.me/api/portraits/men/${id}.jpg`,
          }}
        />
        {isActive && (
          <Avatar.Icon
            size={14}
            icon="circle"
            color={COLOR_ONLINE_GREEN}
            style={{
              position: 'absolute',
              top: 48,
              left: 60,
              backgroundColor: COLOR_ONLINE_GREEN,
            }}
          />
        )}
        <View>
          <Text>
            {firstName} {lastName}
          </Text>
          <Text> {isActive ? 'online' : 'offline'}</Text>
          {showMessage && <Text>This was the last message | Sun</Text>}
        </View>
      </View>
    </Pressable>
  );
};

export default Friend;

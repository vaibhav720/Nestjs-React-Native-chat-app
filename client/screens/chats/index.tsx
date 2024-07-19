import { SafeAreaView } from 'react-native';
import React from 'react';
import Friends from '../../shared/friends/components/Friends';

const ChatsScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Friends showMessage />
    </SafeAreaView>
  );
};

export default ChatsScreen;

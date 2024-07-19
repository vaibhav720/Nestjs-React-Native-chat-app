import React, { useContext } from 'react';
import { NativeRouter, Route, Routes } from 'react-router-native';
import { BottomNavigation as Screens } from 'react-native-paper';
import ChatsScreen from './chats';
import CallScreen from './calls';
import StoriesScreen from './stories';
import PeopleScreen from './people';
import { INavRoutes } from '../types';
import LoginScreen from './login';
import RegisterScreen from './register';
import { AuthContext } from '../shared/auth/context/auth.context';
import ChatScreen from './chat';

const AppScreens = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState<INavRoutes[]>([
    {
      key: 'chats',
      title: 'Chats',
      focusedIcon: 'chat',
    },
    { key: 'calls', title: 'Calls', focusedIcon: 'video' },
    { key: 'people', title: 'People', focusedIcon: 'account' },
    { key: 'stories', title: 'Stroies', focusedIcon: 'book' },
  ]);

  const renderScene = Screens.SceneMap({
    chats: ChatsScreen,
    calls: CallScreen,
    people: PeopleScreen,
    stories: StoriesScreen,
  });

  return (
    <NativeRouter>
      {isLoggedIn ? (
        <Routes>
          <Route
            path="/"
            element={
              <Screens
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={renderScene}
              />
            }
          />
          <Route
            path="/login"
            element={
              <Screens
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={renderScene}
              />
            }
          />
          <Route path="/chat/:friendId" element={<ChatScreen />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<RegisterScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/login" element={<LoginScreen />} />
        </Routes>
      )}
    </NativeRouter>
  );
};

export default AppScreens;

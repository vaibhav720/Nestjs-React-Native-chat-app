import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Appbar, Avatar, IconButton } from 'react-native-paper';
import { useNavigate, useParams } from 'react-router-native';
import { styles } from './styles';
import Input from '../../shared/components/Input';
import {
  COLOR_BLACK,
  COLOR_FB_PRIMARY,
  COLOR_WHITE,
} from '../../shared/constants/colors';
import { IMessage } from '../../shared/chat/interfaces/Message';
import { IConversation } from '../../shared/chat/interfaces/Conversation';
import { AuthContext } from '../../shared/auth/context/auth.context';
import SocketIOClient from 'socket.io-client';

const ChatScreen = () => {
  const { jwt, userDetails } = useContext(AuthContext);
  const { friendId } = useParams();
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [conversations, setConversations] = useState<IConversation[]>([]);
  console.log('messages', messages);

  const conversationId = conversations.find((conversation) =>
    conversation.userIds.includes(+(friendId ?? -1)),
  )?.id;

  const conversationMessages = [...messages].filter(
    (message) => message.conversationId === conversationId,
  );

  const conversationBaseUrl = 'http://localhost:2000';

  const conversationSocket = useMemo(
    () =>
      SocketIOClient(conversationBaseUrl, {
        transportOptions: {
          polling: {
            extraHeaders: {
              Authorization: jwt,
            },
          },
        },
      }),
    [jwt, conversationBaseUrl],
  );

  // getAllConversations
  useEffect(() => {
    if (conversations?.length > 0) return;
    conversationSocket.on(
      'getAllConversations',
      (allConversations: IConversation[]) => {
        setConversations(() => allConversations);
      },
    );
    return () => {
      conversationSocket.off('getAllConversations');
    };
  }, [conversationSocket, conversations]);

  // newMessage
  useEffect(() => {
    conversationSocket.on('newMessage', (message: IMessage) => {
      console.log('message', message);
      setMessages((prev) => [...prev, message]);
    });
    return () => {
      conversationSocket.off('newMessage');
    };
  }, [conversationSocket]);

  const handleSend = () => {
    if (!userDetails || !text) return;
    const newMessage: IMessage = {
      message: text,
      creatorId: userDetails.id,
      conversationId,
    };
    setMessages((prev) => [...prev, newMessage]);

    conversationSocket.emit('sendMessage', {
      message: text,
      friendId,
      conversationId,
    });

    setText('');
  };

  // console.log('conversations', conversations);
  // console.log('conversationId', conversationId);
  // console.log('conversationMessages', conversationMessages);

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigate('/')} />
        <Avatar.Image
          size={36}
          source={{
            uri: `https://randomuser.me/api/portraits/men/${friendId}.jpg`,
          }}
        />

        <View style={{ marginLeft: 8 }}>
          <Text>Name</Text>
          <Text>Active now</Text>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginRight: 8,
          }}
        >
          <IconButton
            icon="phone"
            iconColor={COLOR_FB_PRIMARY}
            style={{ margin: 0 }}
            size={24}
            onPress={() => console.log('Call')}
            accessibilityLabelledBy={undefined}
            accessibilityLanguage={undefined}
          />
          <IconButton
            icon="video"
            iconColor={COLOR_FB_PRIMARY}
            style={{ margin: 0 }}
            size={24}
            onPress={async () => {}}
            accessibilityLabelledBy={undefined}
            accessibilityLanguage={undefined}
          />
        </View>
      </Appbar.Header>

      {/* Messages View */}
      <ScrollView style={styles.chatContainer}>
        <Text>friend id: {friendId}</Text>
        {conversationMessages.map((message, i) => (
          <View
            key={i}
            style={[
              styles.message,
              message.creatorId === userDetails?.id
                ? styles.userMessage
                : styles.friendMessage,
            ]}
          >
            <Text
              style={{
                color:
                  message.creatorId === userDetails?.id
                    ? COLOR_BLACK
                    : COLOR_WHITE,
              }}
            >
              {message.message}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Input */}
      <View
        style={[
          styles.inputContainer,
          { marginHorizontal: 16, marginBottom: 12 },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Input
            mode="outlined"
            placeholder="Type a message..."
            value={text}
            onChangeText={setText}
          />
        </View>
        <IconButton
          icon="send"
          iconColor={COLOR_FB_PRIMARY}
          style={{ margin: 0 }}
          size={32}
          onPress={handleSend}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;

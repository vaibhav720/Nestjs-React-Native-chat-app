import { RedisCacheService } from '@app/shared';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { UserJwt } from 'apps/auth/src/interfaces/user-jwt.interface';
import { firstValueFrom } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { NewMessageDTO } from './dtos/NewMessage.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject('PRESENCE_SERVICE') private readonly presenceService: ClientProxy,
    private readonly cache: RedisCacheService,
    private readonly chatService: ChatService,
  ) {}

  @WebSocketServer()
  server: Server;

  private async setConversationUser<T>(socket: Socket<T, T, T, UserJwt>) {
    const user = socket.data?.user;
    if (!user || !user.id) return;

    const conversationUser = {
      id: user.id,
      socketId: socket.id,
    };

    await this.cache.set(`conversationUser ${user.id}`, conversationUser);
  }

  private async createConversations(socket: Socket, userId: number) {
    const ob2$ = this.authService.send(
      {
        cmd: 'get-friends-list',
      },
      { userId },
    );

    const friends = await firstValueFrom(ob2$).catch((err) =>
      console.error(err),
    );

    friends.forEach(async (friend) => {
      await this.chatService.createConversation(userId, friend.id);
    });
  }

  @SubscribeMessage('getConversations')
  private async getConversations<T>(socket: Socket<T, T, T, UserJwt>) {
    const { user } = socket.data;

    if (!user) return;

    const conversations = await this.chatService.getConversations(user.id);

    this.server.to(socket.id).emit('getAllConversations', conversations);
  }

  async handleDisconnect(socket: Socket) {
    console.log('HANDLE SOCKET DISCONNECT - CONVERSATION', socket);
  }

  async handleConnection<T>(socket: Socket<T, T, T, UserJwt>) {
    console.log('HANDLE SOCKET CONNECTION - CONVERSATION');
    const jwt = socket.handshake.headers.authorization ?? null;
    if (!jwt) {
      this.handleDisconnect(socket);
      return;
    }

    const ob$ = this.authService.send<UserJwt>({ cmd: 'decode-jwt' }, { jwt });
    const res = await firstValueFrom(ob$).catch((err) => console.error(err));

    if (!res || !res?.user) {
      this.handleDisconnect(socket);
      return;
    }

    const { user } = res;
    socket.data.user = user;

    await this.setConversationUser(socket);
    await this.createConversations(socket, user.id);
    await this.getConversations(socket);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage<T>(
    socket: Socket<T, T, T, UserJwt>,
    newMessage: NewMessageDTO,
  ) {
    if (!newMessage) return;

    const { user } = socket.data;

    if (!user) return;

    const createdMessage = await this.chatService.createMessage(
      user.id,
      newMessage,
    );

    const ob$ = this.presenceService.send(
      {
        cmd: 'get-active-user',
      },
      {
        id: newMessage.friendId,
      },
    );

    const activeFriend = await firstValueFrom(ob$).catch((err) =>
      console.error(err),
    );

    if (!activeFriend || !activeFriend.isActive) return;

    const friendDetails = (await this.cache.get(
      `conversationUser ${newMessage.friendId}`,
    )) as { id: number; socketId: string } | undefined;

    if (!friendDetails) return;

    const { id, message, user: creator, conversation } = createdMessage;

    this.server.to(friendDetails.socketId).emit('newMessage', {
      id,
      message,
      creatorId: creator.id,
      conversationId: conversation.id,
    });
  }
}

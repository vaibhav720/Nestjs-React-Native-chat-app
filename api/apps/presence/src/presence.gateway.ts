import { FriendRequestEntity, IActiveUser } from '@app/shared';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { UserJwt } from 'apps/auth/src/interfaces/user-jwt.interface';
import { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class PresenceGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  @WebSocketServer()
  server: Server;

  // NOTE: Remove in production
  async onModuleInit() {
    await this.cache.reset();
  }

  /**
   * Private : Set Active Status Method
   */
  private async setActiveStatus<T>(
    socket: Socket<T, T, T, UserJwt>,
    isActive: boolean,
  ) {
    const user = socket.data?.user;
    if (!user) return;

    const activeUser: IActiveUser = {
      id: user.id,
      socketId: socket.id,
      isActive,
    };

    await this.cache.set(`user ${user.id}`, activeUser, 0);
    await this.emitStatusToFriends(activeUser);
  }

  /**
   * Private : Get Friends Method
   */
  private async getFriends(userId: number) {
    const ob$ = this.authService.send<FriendRequestEntity[]>(
      {
        cmd: 'get-friends',
      },
      {
        userId,
      },
    );

    const friendRequests = await firstValueFrom(ob$).catch((err) =>
      console.error(err),
    );

    if (!friendRequests) return;

    const friends = friendRequests.map((friendRequest) => {
      const isUserCreator = friendRequest.creator.id === userId;
      const friendDetails = isUserCreator
        ? friendRequest.receiver
        : friendRequest.creator;
      const { id, firstName, lastName, email } = friendDetails;
      return {
        id,
        firstName,
        lastName,
        email,
      };
    });

    return friends;
  }

  /**
   * Private : Emit Status to Friends method
   */
  private async emitStatusToFriends(activeUser: IActiveUser) {
    const friends = await this.getFriends(activeUser.id);
    console.log('friends in emitStatusToFriends ==> ✅', friends);

    for (const f of friends) {
      const user = await this.cache.get(`user ${f.id}`);
      if (!user) continue;

      const friend = user as IActiveUser;

      this.server.to(friend.socketId).emit('friendActive', {
        id: activeUser.id,
        isActive: activeUser.isActive,
      });

      if (activeUser.isActive) {
        this.server.to(activeUser.socketId).emit('friendActive', {
          id: friend.id,
          isActive: friend.isActive,
        });
      }
    }
  }

  /**
   * Handle Connection
   */
  async handleConnection<T>(socket: Socket<T, T, T, UserJwt>) {
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
    await this.setActiveStatus(socket, true);
  }

  /**
   * Update Active Status
   * @description this is for updating the status when Closing the Phone
   */
  @SubscribeMessage('updateActiveStatus')
  async updateActiveStatus<T>(
    socket: Socket<T, T, T, UserJwt>,
    isActive: boolean,
  ) {
    if (!socket.data?.user) return;
    await this.setActiveStatus(socket, isActive);
  }

  /**
   * Handle Disconnect
   */
  async handleDisconnect<T>(socket: Socket<T, T, T, UserJwt>) {
    await this.setActiveStatus(socket, false);
  }
}

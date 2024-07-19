import {
  ConversationRepositoryInterface,
  MessageRepositoryInterface,
  UserEntity,
} from '@app/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NewMessageDTO } from './dtos/NewMessage.dto';

@Injectable()
export class ChatService {
  constructor(
    @Inject('ConversationRepositoryInterface')
    private readonly conversationRepository: ConversationRepositoryInterface,

    @Inject('MessageRepositoryInterface')
    private readonly messageRepository: MessageRepositoryInterface,

    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  getHello(): string {
    return 'Hello from chat!';
  }

  private async getUser(id: number) {
    const ob$ = this.authService.send<UserEntity>(
      {
        cmd: 'get-user',
      },
      {
        id,
      },
    );
    const user = await firstValueFrom(ob$).catch((err) => console.error(err));
    return user;
  }

  async getConversations(userId: number) {
    const allConversations =
      await this.conversationRepository.findWithRelations({
        relations: ['users'],
      });

    const userConversations = allConversations.filter((conversation) => {
      const userIds = conversation.users.map((user) => user.id);
      return userIds.includes(userId);
    });

    return userConversations.map((conversation) => ({
      id: conversation.id,
      userIds: (conversation?.users ?? []).map((user) => user.id),
    }));
  }

  async createConversation(userId: number, friendId: number) {
    const user = await this.getUser(userId);
    const friend = await this.getUser(friendId);

    if (!user || !friend) return;

    const conversation = await this.conversationRepository.findConversation(
      userId,
      friendId,
    );

    if (!conversation) {
      return await this.conversationRepository.save({
        users: [user, friend],
      });
    }

    return conversation;
  }

  async createMessage(userId: number, newMessage: NewMessageDTO) {
    const user = await this.getUser(userId);

    if (!user) return;

    const conversation = await this.conversationRepository.findByCondition({
      where: [{ id: newMessage.conversationId }],
      relations: ['users'],
    });

    if (!conversation) return;

    return await this.messageRepository.save({
      message: newMessage.message,
      user,
      conversation,
    });
  }
}

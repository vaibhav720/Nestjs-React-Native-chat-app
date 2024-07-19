import {
  ConversationEntity,
  ConversationRepository,
  FriendRequestEntity,
  MessageEntity,
  MessageRepository,
  PostgresDBModule,
  RedisModule,
  SharedModule,
  UserEntity,
} from '@app/shared';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [
    PostgresDBModule,
    RedisModule,
    SharedModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
    SharedModule.registerRmq(
      'PRESENCE_SERVICE',
      process.env.RABBITMQ_PRESENCE_QUEUE,
    ),
    TypeOrmModule.forFeature([
      UserEntity,
      FriendRequestEntity,
      ConversationEntity,
      MessageEntity,
    ]),
  ],
  controllers: [ChatController],
  providers: [
    ChatService,
    ChatGateway,
    {
      provide: 'ConversationRepositoryInterface',
      useClass: ConversationRepository,
    },
    {
      provide: 'MessageRepositoryInterface',
      useClass: MessageRepository,
    },
  ],
})
export class ChatModule {}

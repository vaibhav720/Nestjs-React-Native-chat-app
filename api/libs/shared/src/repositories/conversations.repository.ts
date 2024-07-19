import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConversationEntity } from '../entities/conversation.entity';
import { ConversationRepositoryInterface } from '../interfaces/conversation.repository.interface';
import { BaseAbstractRepository } from './base/base.abstract.respository';

@Injectable()
export class ConversationRepository
  extends BaseAbstractRepository<ConversationEntity>
  implements ConversationRepositoryInterface
{
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
  ) {
    super(conversationRepository);
  }

  public async findConversation(
    userId: number,
    friendId: number,
  ): Promise<ConversationEntity | undefined> {
    return await this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoin('conversation.users', 'user')
      .where('user.id = :userId', { userId })
      .orWhere('user.id = :friendId', { friendId })
      .groupBy('conversation.id')
      .having('COUNT(*) > 1')
      .getOne();
  }
}

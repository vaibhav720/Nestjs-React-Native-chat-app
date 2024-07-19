import { ConversationEntity } from '../entities/conversation.entity';
import { BaseInterfaceRepository } from '../repositories/base/base.interface.repository';

export interface ConversationRepositoryInterface
  extends BaseInterfaceRepository<ConversationEntity> {
  /**
   * Find Conversation Method
   * @param { number } userId - LoggedIn User ID
   * @param { number } friendId - Friend ID
   */
  findConversation(
    userId: number,
    friendId: number,
  ): Promise<ConversationEntity | undefined>;
}

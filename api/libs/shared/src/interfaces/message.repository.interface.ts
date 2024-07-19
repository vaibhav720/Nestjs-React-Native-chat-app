/* eslint-disable @typescript-eslint/no-empty-interface */
import { MessageEntity } from '../entities/message.entity';
import { BaseInterfaceRepository } from '../repositories/base/base.interface.repository';

export interface MessageRepositoryInterface
  extends BaseInterfaceRepository<MessageEntity> {}

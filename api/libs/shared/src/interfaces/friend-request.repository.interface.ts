/* eslint-disable @typescript-eslint/no-empty-interface */

import { FriendRequestEntity } from '../entities/friend-request.entity';
import { BaseInterfaceRepository } from '../repositories/base/base.interface.repository';

export interface FriendRequestRepositoryInterface
  extends BaseInterfaceRepository<FriendRequestEntity> {}

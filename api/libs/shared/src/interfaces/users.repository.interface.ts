import { UserEntity } from '@app/shared';
import { BaseInterfaceRepository } from '../repositories/base/base.interface.repository';

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface UserRepositoryInterface
  extends BaseInterfaceRepository<UserEntity> {}

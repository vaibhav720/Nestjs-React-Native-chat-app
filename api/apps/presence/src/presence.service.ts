import { IActiveUser, RedisCacheService } from '@app/shared';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PresenceService {
  constructor(private readonly cache: RedisCacheService) {}

  getHello(): { foo: string } {
    console.log('NOT CACHED');
    return {
      foo: 'Hello from Presence!',
    };
  }

  async getActiveUser(id: number): Promise<IActiveUser | undefined> {
    const user = await this.cache.get(`user ${id}`);
    return user as IActiveUser | undefined;
  }
}

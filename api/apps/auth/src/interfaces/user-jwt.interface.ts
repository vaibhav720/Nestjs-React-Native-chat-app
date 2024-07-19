import { UserRequest } from '@app/shared';

/**
 * UserJwt interface including UserInfo and
 * Initialization Date and Expiratin Date
 */
export interface UserJwt extends UserRequest {
  iat: number;
  exp: number;
}

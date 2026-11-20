import { UserEntity } from '../entities/user.entity';

export {};

declare global {
  namespace Express {
    export interface Request {
      user: Omit<UserEntity, 'password'>;
    }
  }
}

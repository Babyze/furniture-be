import { User } from './user.model';

export interface Customer extends User {
  isAgreeAllPolicy: boolean;
}

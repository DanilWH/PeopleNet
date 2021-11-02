import { UserSubscription } from "./userSubscription";

export class User {
  id: number;
  username: string;
  password: string;
  avatar: string;
  email: string;
  gender: string;
  lastVisit: number;
  roles: string[];
  subscriptions: UserSubscription[];
  subscribers: UserSubscription[];
}

import {User} from "./user";

export interface UserSubscription {
    subscriber: User;
    channel: User;
    active: boolean;
}

import { Message } from "./message";
import { User } from "./user";

export interface Comment {
    id: number;
    text: string;
    message: Message;
    author: User;
}

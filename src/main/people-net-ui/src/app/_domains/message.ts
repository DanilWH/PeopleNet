import { Comment } from "./comment";
import { User } from "./user";

export interface Message {
    id: string;
    text: string;
    author: User;
    comments: Comment[];
    creationDate: string;
}

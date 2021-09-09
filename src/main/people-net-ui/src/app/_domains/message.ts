import { Comment } from "./comment";

export interface Message {
  id: string;
  text: string;
  comments: Comment[];
}

import {Message} from "./message";

export interface MessagePage {
    messages: Message[];
    currentPage: number;
    totalPages: number;
}

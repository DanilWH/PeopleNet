import {Message} from "../_domains/message";
import {
    ADD_COMMENT,
    ADD_MESSAGE,
    ADD_MESSAGE_PAGE,
    REMOVE_MESSAGE,
    UPDATE_CURRENT_PAGE,
    UPDATE_MESSAGE,
    UPDATE_TOTAL_PAGES
} from "./actions";

export interface IAppState {
    messages: Message[];
    currentPage: number;
    totalPages: number;
}

export const INITIAL_STATE: IAppState = {
    messages: [],
    currentPage: -1,
    totalPages: 1
}

export function rootReducer(state: any, action: any) {
    switch (action.type) {
        case ADD_MESSAGE:
            return Object.assign({}, state, {
                messages: state.messages.concat(Object.assign({}, action.message))
            });

        case UPDATE_MESSAGE:
            const updateMessageIndex = state.messages.findIndex((item: Message) => item.id === action.message.id);
            return Object.assign({}, state, {
                messages: [
                    ...state.messages.slice(0, updateMessageIndex),
                    Object.assign({}, action.message),
                    ...state.messages.slice(updateMessageIndex + 1)
                ]
            });

        case REMOVE_MESSAGE:
            return Object.assign({}, state, {
                messages: state.messages.filter((item: Message) => item.id !== action.message.id)
            });

        case ADD_COMMENT:
            const messageIndex = state.messages.findIndex((item: Message) => item.id === action.comment.message.id);
            const message = state.messages[messageIndex];

            return Object.assign({}, state, {
                messages: [
                    ...state.messages.slice(0, messageIndex),
                    Object.assign({}, message, {
                        comments: [
                            ...message.comments,
                            action.comment
                        ]
                    }),
                    ...state.messages.slice(messageIndex + 1)
                ]
            });

        case ADD_MESSAGE_PAGE:
            const concatMessages: Message[] = state.messages.concat(action.messages);
            const uniqueMessages: Message[] = concatMessages.filter((currentMessage: Message, currentMessageIdx: number) => {
                const initialMessageIdx = concatMessages.findIndex((initialMessage: Message) => initialMessage.id === currentMessage.id);
                return initialMessageIdx === currentMessageIdx;
            });

            return Object.assign({}, state, {
                messages: uniqueMessages
            });

        case UPDATE_CURRENT_PAGE:
            state.currentPage = action.currentPage;
            break;

        case UPDATE_TOTAL_PAGES:
            state.totalPages = action.totalPages;
            break;
    }

    return state;
}

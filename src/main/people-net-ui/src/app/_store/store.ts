import { Message } from "../_domains/message";
import { ADD_COMMENT, ADD_MESSAGE, REMOVE_MESSAGE, UPDATE_MESSAGE } from "./actions";

export interface IAppState {
    messages: Message[]
}

export const INITIAL_STATE: IAppState = {
    messages: []
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
    }

    return state;
}

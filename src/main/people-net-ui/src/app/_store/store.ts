import { Message } from "../_domains/message";
import { ADD_MESSAGE, REMOVE_MESSAGE, UPDATE_MESSAGE } from "./actions";
import { NgRedux } from "@angular-redux/store";
import { MessageService } from "../_services/message.service";
import { HttpErrorResponse } from "@angular/common/http";

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
            const index = state.messages.findIndex((item: Message) => item.id === action.message.id);
            return Object.assign({}, state, {
                messages: [
                    ...state.messages.slice(0, index),
                    Object.assign({}, action.message),
                    ...state.messages.slice(index + 1)
                ]
            });

        case REMOVE_MESSAGE:
            return Object.assign({}, state, {
                messages: state.messages.filter((item: Message) => item.id !== action.message.id)
            });
    }

    return state;
}

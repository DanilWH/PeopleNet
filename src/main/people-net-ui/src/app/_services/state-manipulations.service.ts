import { Injectable } from '@angular/core';
import { Message } from "../_domains/message";
import { ADD_MESSAGE, REMOVE_MESSAGE, UPDATE_MESSAGE } from "../_store/actions";
import { NgRedux } from "@angular-redux/store";
import { IAppState } from "../_store/store";
import { MessageService } from "./message.service";

@Injectable({
    providedIn: 'root'
})
export class StateManipulationsService {

    constructor(
        private ngRedux: NgRedux<IAppState>,
        private messageService: MessageService
    ) {
    }

    public addMessageMutation(message: Message) {
        const index = this.ngRedux.getState().messages.findIndex(item => item.id === message.id); // todo try @select('messages') messages;

        if (index > -1) {
            // the message is already present.
            this.ngRedux.dispatch({type: UPDATE_MESSAGE, message: message});
        } else {
            this.ngRedux.dispatch({type: ADD_MESSAGE, message: message});
        }
    }

    public updateMessageMutation(message: Message) {
        this.ngRedux.dispatch({type: UPDATE_MESSAGE, message: message});
    }

    public removeMessageMutation(message: Message) {
        this.ngRedux.dispatch({type: REMOVE_MESSAGE, message: message});
    }

    public async addMessageAction(message: Message) {
        const data = await this.messageService.addMessage(message).toPromise();
        this.addMessageMutation(data);
    }

    public async updateMessageAction(message: Message) {
        const data = await this.messageService.updateMessage(message).toPromise();
        this.updateMessageMutation(data);
    }

    public async removeMessageAction(message: Message) {
        await this.messageService.deleteMessage(message.id).toPromise();
        this.removeMessageMutation(message);
    }
}

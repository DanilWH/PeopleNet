import { Injectable } from '@angular/core';
import { Message } from "../_domains/message";
import { ADD_COMMENT, ADD_MESSAGE, ADD_MESSAGE_PAGE, REMOVE_MESSAGE, UPDATE_CURRENT_PAGE, UPDATE_MESSAGE, UPDATE_TOTAL_PAGES } from "../_store/actions";
import { NgRedux } from "@angular-redux/store";
import { IAppState } from "../_store/store";
import { MessageService } from "./message.service";
import { CommentService } from "./comment.service";
import { Comment } from "../_domains/comment";
import {MessagePage} from "../_domains/messagePage";

@Injectable({
    providedIn: 'root'
})
export class StateManipulationsService {

    private isRequested: boolean = false;

    constructor(
        private ngRedux: NgRedux<IAppState>,
        private messageService: MessageService,
        private commentService: CommentService
    ) { }

    /*** MUTATIONS ***/
    public addMessageMutation(message: Message) {
        const index = this.ngRedux.getState().messages.findIndex(item => item.id === message.id); // todo try @select('messages') messages;

        if (index > -1) {
            // the message is already present.
            this.ngRedux.dispatch({type: UPDATE_MESSAGE, message: message});
        } else {
            this.ngRedux.dispatch({ type: ADD_MESSAGE, message: message });
        }
    }

    public updateMessageMutation(message: Message) {
        this.ngRedux.dispatch({ type: UPDATE_MESSAGE, message: message });
    }

    public removeMessageMutation(message: Message) {
        this.ngRedux.dispatch({ type: REMOVE_MESSAGE, message: message });
    }

    public addCommentMutation(comment: Comment) {
        const message = this.ngRedux.getState().messages.find((item: Message) => item.id === comment.message.id);
        const index = message.comments.findIndex((item: Comment) => item.id === comment.id);

        if (index === -1) {
            this.ngRedux.dispatch({ type: ADD_COMMENT, comment: comment})
        }
    }

    public loadMessagePageMutation(messages: Message[]) {
        this.ngRedux.dispatch({ type: ADD_MESSAGE_PAGE, messages: messages });
    }

    public updateCurrentPageMutation(currentPage: number) {
        this.ngRedux.dispatch({ type: UPDATE_CURRENT_PAGE, currentPage: currentPage });
    }

    public updateTotalPagesMutation(totalPages: number) {
        this.ngRedux.dispatch({ type: UPDATE_TOTAL_PAGES, totalPages: totalPages });
    }


    /*** ACTIONS ***/
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

    public async addCommentAction(comment: Comment) {
        const data = await this.commentService.addComment(comment).toPromise();
        this.addCommentMutation(data);
    }

    public loadMessagePageAction() {
        console.log(this.ngRedux.getState().currentPage);
        console.log(this.ngRedux.getState().totalPages);
        if (this.ngRedux.getState().currentPage < this.ngRedux.getState().totalPages - 1 && !this.isRequested) {
            this.isRequested = true;
            this.messageService.getMessagePage(this.ngRedux.getState().currentPage + 1).subscribe(
                (data) => {
                    this.isRequested = false;
                    this.loadMessagePageMutation(data.messages);
                    this.updateCurrentPageMutation(data.currentPage);
                    this.updateTotalPagesMutation(data.totalPages);
                }
            )
        }
    }
}

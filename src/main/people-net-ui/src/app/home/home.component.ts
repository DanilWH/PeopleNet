import {Component, HostListener, OnInit} from '@angular/core';
import { Message } from "../_domains/message";
import { MessageService } from "../_services/message.service";
import { NgForm } from "@angular/forms";
import { WebSocketService } from "../_services/web-socket.service";
import { TokenStorageService } from "../_services/token-storage.service";
import { StateManipulationsService } from "../_services/state-manipulations.service";
import { select } from "@angular-redux/store";
import { Observable } from "rxjs";
import { Comment } from "../_domains/comment";
import { COMMENT, MESSAGE } from "./object-types";
import { CREATE, REMOVE, UPDATE } from "./event-types";

const headers = {
    'Authorization': 'Bearer ' + new TokenStorageService().getAccessToken()
}

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    @select('messages') messages: Observable<Message[]>;
    public editingMessage: Message = null;

    constructor(
        private messageService: MessageService,
        private webSocketService: WebSocketService,
        private stateManipulationsService: StateManipulationsService,
        private tokenStorageService: TokenStorageService
    ) { }

    ngOnInit(): void {
        this.webSocketService.addHandler((data: any) => {
            if (data.objectType === MESSAGE) {
                switch (data.eventType) {
                    case CREATE:
                        this.stateManipulationsService.addMessageMutation(data.body);
                        break;
                    case UPDATE:
                        this.stateManipulationsService.updateMessageMutation(data.body);
                        break;
                    case REMOVE:
                        this.stateManipulationsService.removeMessageMutation(data.body);
                        break;
                    default:
                        console.log(`Looks like the event type is unknown "${data.eventType}".`);
                }
            }
            else if (data.objectType === COMMENT) {
                switch (data.eventType) {
                    case CREATE:
                        this.stateManipulationsService.addCommentMutation(data.body);
                        break;
                    default:
                        console.log(`Looks like the event type is unknown "${data.eventType}".`);
                }
            }
            else {
                console.log(`Looks like the object type is unknown "${data.objectType}" .`);
            }
        });

        this.stateManipulationsService.loadMessagePageAction();
    }

    @HostListener("window:scroll", ["$event"])
    onWindowScroll() {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

        if (scrollTop + clientHeight >= scrollHeight - 1) {
            console.log("bottoom");
            this.stateManipulationsService.loadMessagePageAction();
        }
    }

    public onSaveMessage(saveMessageForm: NgForm): void {
        if (this.editingMessage) {
            this.stateManipulationsService.updateMessageAction(Object.assign({}, this.editingMessage, saveMessageForm.value));
            this.editingMessage = null;
        }
        else {
            this.stateManipulationsService.addMessageAction(saveMessageForm.value);
        }

        saveMessageForm.reset();
    }

    public onEditMessage(message: Message): void {
        this.editingMessage = message;
    }

    public onDeleteMessage(message: Message): void {
        this.stateManipulationsService.removeMessageAction(message);
    }

    public onAddComment(message: Message, commentForm: NgForm): void {
        const comment: Comment = Object.assign(commentForm.value, {
            message: {
                id: message.id
            }
        });

        this.stateManipulationsService.addCommentAction(comment);
        commentForm.reset();
    }

    public isMyMessage(message: Message): boolean {
        return message.author.id === this.tokenStorageService.getUser().id;
    }
}

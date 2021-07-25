import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from './message';
import { MessageService } from './message.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    public messages: Message[];
    public message: Message = null;

    constructor(private messageService: MessageService) { }

    ngOnInit(): void {
        this.messageService.getMessages().subscribe(
            (data: Message[]) => {
                this.messages = data;
            },
            (error: HttpErrorResponse) => {
                alert(error.message);
            }
        )
    }

    public onSaveMessage(saveMessageForm: NgForm): void {
        if (this.message) {
            this.messageService.updateMessage(this.message.id, saveMessageForm.value).subscribe(
                (data: Message) => {
                    let oldMessageIndex = this.messages.indexOf(this.message);
                    this.messages.splice(oldMessageIndex, 1, data);

                    // reset the message to null.
                    this.message = null;
                },
                (error: HttpErrorResponse) => {
                    console.log(error.message);
                }
            );
        } else {
            this.messageService.addMessage(saveMessageForm.value).subscribe(
                (data: Message) => {
                    this.messages.push(data);
                    saveMessageForm.reset();
                },
                (error: HttpErrorResponse) => {
                    console.log(error.message);
                }
            );
        }
    }

    public onEditMessage(message: Message): void {
        this.message = message;
    }

    public onDeleteMessage(message: Message): void {
        this.messageService.deleteMessage(message.id).subscribe(
            () => {
                this.messages.splice(this.messages.indexOf(message), 1);
            }
        )
    }
}

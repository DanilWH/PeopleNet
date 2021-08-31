import { Component, OnInit } from '@angular/core';
import { Message } from "../_domains/message";
import { MessageService } from "../_services/message.service";
import { HttpErrorResponse } from "@angular/common/http";
import { NgForm } from "@angular/forms";
import { WebSocketService } from "../_services/web-socket.service";
import { TokenStorageService } from "../_services/token-storage.service";

const headers = {
  'Authorization': 'Bearer ' + new TokenStorageService().getAccessToken()
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public messages: Message[];
  public editingMessage: Message = null;

  constructor(
    private messageService: MessageService,
    private webSocketService: WebSocketService
  ) { }

  ngOnInit(): void {
    this.messageService.getMessages().subscribe(
      (data: Message[]) => {
        this.messages = data;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );

    this.webSocketService.addHandler((data: any) => {
      if (data.objectType === 'MESSAGE') {
        const index = this.messages.findIndex(item => item.id === data.body.id);
        console.log("addHandler: " + index);

        switch (data.eventType) {
          case 'CREATE':
          case 'UPDATE':
            if (index > -1) {
              // the object is present.
              this.messages.splice(index, 1, data.body);
              console.log("addHandler splice");
            }
            else {
              this.messages.push(data.body);
              console.log("addHandler push");
            }
            break;
          case 'REMOVE':
            this.removeMessageFromList(index);
            break;
          default:
            console.log(`Looks like the event type is unknown "${data.eventType}".`);
        }
      }
      else {
        console.log(`Looks like the object type is unknown "${data.objectType}" .`);
      }
    });
  }

  public onSaveMessage(saveMessageForm: NgForm): void {
    if (this.editingMessage) {
      this.messageService.updateMessage(saveMessageForm.value).subscribe(
        (data: Message) => {
          const index = this.messages.findIndex(item => item.id === data.id);
          this.messages.splice(index, 1, data);

          // reset the message to null.
          this.editingMessage = null;
        },
        (error: HttpErrorResponse) => {
          console.log(error.message);
        }
      );
    }
    else {
      this.messageService.addMessage(saveMessageForm.value).subscribe(
        (data: Message) => {
          const index = this.messages.findIndex(item => item.id === data.id);
          console.log("onSaveMessage: " + index);

          if (index > -1) {
            // the message is already present.
            this.messages.splice(index, 1, data);
            console.log("onSaveMessage splice");
          }
          else {
            this.messages.push(data);
            console.log("onSaveMessage push");
          }
        },
        (error: HttpErrorResponse) => {
          console.log(error.message);
        }
      );
    }

    saveMessageForm.reset();
  }

  public onEditMessage(message: Message): void {
    this.editingMessage = message;
  }

  public onDeleteMessage(message: Message): void {
    this.messageService.deleteMessage(message.id).subscribe(
      () => {
        this.removeMessageFromList(this.messages.findIndex(item => item.id === message.id));
      }
    )
  }

  private removeMessageFromList(index: number): void {
    if (index > -1) {
      // if the message is present.
      this.messages.splice(index, 1);
    }
  }
}

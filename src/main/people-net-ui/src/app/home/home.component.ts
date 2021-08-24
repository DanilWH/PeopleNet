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
      let oldMessageIndex = this.messages.findIndex(message => message.id === data.id);

      if (oldMessageIndex !== -1) {
        this.messages.splice(oldMessageIndex, 1, data);
      }
      else {
        this.messages.push(data);
      }
    });
  }

  public onSaveMessage(saveMessageForm: NgForm): void {
    this.webSocketService.sendMessage({ id: this.editingMessage?.id, text: saveMessageForm.value.text });
    saveMessageForm.reset();
  }

  public onEditMessage(message: Message): void {
    this.editingMessage = message;
  }

  public onDeleteMessage(message: Message): void {
    this.messageService.deleteMessage(message.id).subscribe(
      () => {
        this.messages.splice(this.messages.indexOf(message), 1);
      }
    )
  }
}

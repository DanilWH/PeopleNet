import { Component, OnInit } from '@angular/core';
import { Message } from "../_domains/message";
import { MessageService } from "../_services/message.service";
import { HttpErrorResponse } from "@angular/common/http";
import { NgForm } from "@angular/forms";
import { WebSocketService } from "../_services/web-socket.service";
import * as SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
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
  public webSocketEndpoint = 'http://localhost:8080/ws';
  public stompClient: any = null;

  public messages: Message[];
  public editingMessage: Message = null;

  constructor(
    private messageService: MessageService,
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

    this.connect();
  }

  public onSaveMessage(saveMessageForm: NgForm): void {
    this.sendMessage({ id: this.editingMessage?.id, text: saveMessageForm.value.text });
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

  public connect(): void {
    let socket = new SockJS(this.webSocketEndpoint);
    this.stompClient = Stomp.over(socket);

    const _this = this;
    this.stompClient.connect({}, (frame: any) => {
      _this.stompClient.subscribe('/topic/activity', (data: any) => {
        let parsedData: Message = JSON.parse(data.body);
        let oldMessageIndex = this.messages.findIndex(message => message.id === parsedData.id);

        if (oldMessageIndex !== -1) {
          this.messages.splice(oldMessageIndex, 1, parsedData);
        }
        else {
          this.messages.push(parsedData);
        }
      });
    });
  }

  public disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.ws.close();
    }
    console.log("Disconnected");
  }

  public sendMessage(message: Message) {
      this.stompClient.send('/app/changeMessage', headers, JSON.stringify(message));
  }
}

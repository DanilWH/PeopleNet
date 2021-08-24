import { Injectable } from '@angular/core';
import { Message } from "../_domains/message";
import * as SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { TokenStorageService } from "./token-storage.service";

let handlers: any[] = [];

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  public webSocketEndpoint = 'http://localhost:8080/ws';
  public stompClient: any = null;

  constructor(private tokenStorageService: TokenStorageService) { }

  public connect(): void {
    let socket = new SockJS(this.webSocketEndpoint);
    this.stompClient = Stomp.over(socket);

    const _this = this;
    this.stompClient.connect({}, (frame: any) => {
      _this.stompClient.subscribe('/topic/activity', (data: any) => {
        handlers.forEach(handler => handler(JSON.parse(data.body)))
      });
    });
  }

  addHandler(handler: any) {
    handlers.push(handler);
  }

  public disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.ws.close();
    }
    console.log("Disconnected");
  }

  public sendMessage(message: Message) {
    this.stompClient.send('/app/changeMessage', {}, JSON.stringify(message));
  }
}

import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { Message } from "../_domains/message";
import * as SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { HttpHeaders } from "@angular/common/http";
import { TokenStorageService } from "./token-storage.service";
import { HomeComponent } from "../home/home.component";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  constructor(private tokenStorageService: TokenStorageService) { }
}

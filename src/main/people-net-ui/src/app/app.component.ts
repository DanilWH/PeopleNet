import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from './_domains/message';
import { MessageService } from './_services/message.service';
import { TokenStorageService } from "./_services/token-storage.service";
import { User } from "./_domains/user";
import { WebSocketService } from "./_services/web-socket.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public userInfo: User = new User();
  public isLoggedIn: boolean = false;

  constructor(
    private tokenStorageService: TokenStorageService,
    private webSocketService: WebSocketService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getAccessToken();

    if (this.isLoggedIn) {
      this.userInfo = this.tokenStorageService.getUser();
    }

    this.webSocketService.connect();
  }

  logout(): void {
    this.tokenStorageService.logout();
    window.location.reload();
  }
}

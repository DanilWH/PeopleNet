import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from "./_services/token-storage.service";
import {User} from "./_domains/user";
import {WebSocketService} from "./_services/web-socket.service";
import {StateManipulationsService} from './_services/state-manipulations.service';

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
        private webSocketService: WebSocketService,
        private stateManipulationsService: StateManipulationsService
    ) {
    }

    ngOnInit(): void {
        this.isLoggedIn = !!this.tokenStorageService.getAccessToken();

        if (this.isLoggedIn) {
            this.userInfo = this.tokenStorageService.getUser();
            this.webSocketService.connect();
        }
    }

    logout(): void {
        this.tokenStorageService.logout();
        window.location.reload();
    }
}

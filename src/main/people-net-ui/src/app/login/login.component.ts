import {Component, OnInit} from '@angular/core';
import {AuthService} from "../_services/auth.service";
import {User} from "../_domains/user";
import {TokenStorageService} from "../_services/token-storage.service";
import {ActivatedRoute, Route, Router, Routes} from "@angular/router";
import {ProfileService} from "../_services/profile.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    public form: User = new User();
    public isLoggedIn: boolean = false;
    public isLoginFail: boolean = false;
    public infoMessage: string = '';

    constructor(
        private authService: AuthService,
        private tokenStorageService: TokenStorageService,
        private route: ActivatedRoute,
        private profileService: ProfileService
    ) {
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(
            (params) => {
                if (params.registered !== undefined && params.registered === 'true') {
                    this.infoMessage = 'Registration is successful! Please, login.';
                }
            }
        );

        if (this.tokenStorageService.getAccessToken()) {
            this.isLoggedIn = true;
        }
    }

    public onSubmit(): void {
        this.authService.login(this.form.username, this.form.password).subscribe(
            (jwtResponse: any) => {
                this.tokenStorageService.saveTokens(jwtResponse.accessToken, jwtResponse.refreshToken);
                this.profileService.get(jwtResponse.id).subscribe(
                    (user: User) => {
                        this.tokenStorageService.saveUser(user);

                        this.isLoggedIn = true;
                        this.isLoginFail = false;
                        this.infoMessage = '';

                        this.reloadPage();
                    }
                );
            },
            (error: any) => {
                console.log(error.getMessage());
                this.isLoginFail = true;
            }
        )
    }

    private reloadPage(): void {
        window.location.reload();
    }

}

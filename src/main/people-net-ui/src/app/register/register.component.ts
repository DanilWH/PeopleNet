import { Component, OnInit } from '@angular/core';
import { AuthService } from "../_services/auth.service";
import { User } from "../_domains/user";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";

const DEFAULT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/892/892781.png';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    public form: User = new User();
    public registrationFailStatus: number = null;
    public repeatPassword: string = '';
    public passwordMatch: boolean = true;
    public isUsernameBusy: boolean = false;

    constructor(
        private authService: AuthService,
        private router: Router
    ) {
    }

    ngOnInit(): void {
    }

    public onSubmit(): void {
        if (!this.form.avatar) {
            this.form.avatar = DEFAULT_AVATAR;
        }

        this.authService.register(
            this.form.username,
            this.form.password,
            this.form.avatar,
            this.form.email,
            this.form.gender
        ).subscribe(
            (data: any) => {
                this.registrationFailStatus = null;
                this.router.navigate(['login'], {queryParams: {registered: 'true'}});
            },
            (error: HttpErrorResponse) => {
                this.registrationFailStatus = error.status;
                if (this.registrationFailStatus === 409) {
                    this.isUsernameBusy = true;
                }
            }
        );
    }

    public onPasswordInput(): void {
        if (this.form.password === this.repeatPassword) {
            this.passwordMatch = true;
        } else {
            this.passwordMatch = false;
        }
    }

    public onBlur(): void {
        this.isUsernameBusy = false;
    }
}

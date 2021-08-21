import { Component, OnInit } from '@angular/core';
import { AuthService } from "../_services/auth.service";
import { User } from "../_domains/user";
import { TokenStorageService } from "../_services/token-storage.service";
import { ActivatedRoute, Route, Router, Routes } from "@angular/router";

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
    private route: ActivatedRoute
  ) { }

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
      (data: User) => {
        this.tokenStorageService.saveTokens(data.accessToken, data.refreshToken);
        this.tokenStorageService.saveUser(data);

        this.isLoggedIn = true;
        this.isLoginFail = false;
        this.infoMessage = '';

        this.reloadPage();
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

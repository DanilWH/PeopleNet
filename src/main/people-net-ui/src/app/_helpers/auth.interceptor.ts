import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from "../_services/token-storage.service";
import { User } from "../_domains/user";

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private tokenStorageService: TokenStorageService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.tokenStorageService.getAccessToken();
    const refreshToken = this.tokenStorageService.getRefreshToken();

    if (accessToken != null && refreshToken != null) {
      request = request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + accessToken) });

      let user: User = this.tokenStorageService.getUser();
      user.lastVisit = Date.now();
      this.tokenStorageService.saveUser(user);
    }

    return next.handle(request);
  }
}

export const authInterceptorProvider = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
]

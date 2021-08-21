import { Injectable } from '@angular/core';
import { User } from "../_domains/user";

const ACCESS_TOKEN_KEY = 'access-token';
const REFRESH_TOKEN_KEY = 'refresh-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  saveTokens(accessToken: string, refreshToken: string): void {
    // save the access token.
    window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    window.sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

    // save the refresh token.
    window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    window.sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  getAccessToken(): string {
    return window.sessionStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string {
    return window.sessionStorage.getItem(REFRESH_TOKEN_KEY);
  }

  saveUser(user: User): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUser(): User {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return null;
  }

  logout(): void {
    window.sessionStorage.clear();
  }
}

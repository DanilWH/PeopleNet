import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";

const AUTH_API = environment.apiBaseUrl + '/api/auth';
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + '/login', {username, password}, httpOptions);
  }

  // TODO create a domain class for the new user.
  register(username: string, password: string, avatar: string, email: string, gender: string) {
    return this.http.post(AUTH_API + '/register', {username, password, avatar, email, gender}, httpOptions);
  }
}

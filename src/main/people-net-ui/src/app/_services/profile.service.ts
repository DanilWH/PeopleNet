import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../_domains/user";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

const serverApi = environment.apiBaseUrl;

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    constructor(private http: HttpClient) { }

    public get(id: number): Observable<User> {
        return this.http.get<User>(`${serverApi}/api/profile/${id}`);
    }

    public changeSubscription(channel: User): Observable<User> {
        return this.http.post<User>(`${serverApi}/api/profile/change-subscription/${channel.id}`, {});
    }
}

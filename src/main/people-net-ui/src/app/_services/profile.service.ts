import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { User } from "../_domains/user";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { UserSubscription } from '../_domains/userSubscription';

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

    public getSubscribers(channelId: number): Observable<UserSubscription[]> {
        return this.http.get<UserSubscription[]>(`${serverApi}/api/profile/get-subscribers/${channelId}`);
    }

    public changeSubscriptionStatus(subscriberId: number): Observable<UserSubscription> {
        return this.http.post<UserSubscription>(`${serverApi}/api/profile/change-subscription-status/${subscriberId}`, {});
    }
}

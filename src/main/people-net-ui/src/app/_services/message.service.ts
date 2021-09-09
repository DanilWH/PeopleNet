import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Message } from "../_domains/message";
import { environment } from 'src/environments/environment';

const apiServerUrl = environment.apiBaseUrl;

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    constructor(private http: HttpClient) { }

    public getMessages(): Observable<Message[]> {
        return this.http.get<Message[]>(`${apiServerUrl}/api/message`);
    }

    public getMessage(id: string): Observable<Message> {
        return this.http.get<Message>(`${apiServerUrl}/api/message/${id}`);
    }

    public addMessage(message: Message): Observable<Message> {
        return this.http.post<Message>(`${apiServerUrl}/api/message`, message);
    }

    public updateMessage(message: Message): Observable<Message> {
        return this.http.put<Message>(`${apiServerUrl}/api/message/${message.id}`, message);
    }

    public deleteMessage(id: string): Observable<void> {
        return this.http.delete<void>(`${apiServerUrl}/api/message/${id}`);
    }
}

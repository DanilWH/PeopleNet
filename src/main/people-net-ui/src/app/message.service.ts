import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Message } from "./message";
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    private apiServerUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient) { }

    public getMessages(): Observable<Message[]> {
        return this.http.get<Message[]>(`${this.apiServerUrl}/message`);
    }

    public getMessage(id: string): Observable<Message> {
        return this.http.get<Message>(`${this.apiServerUrl}/message/${id}`);
    }

    public addMessage(message: Message): Observable<Message> {
        return this.http.post<Message>(`${this.apiServerUrl}/message`, message);
    }

    public updateMessage(id: string, message: Message): Observable<Message> {
        return this.http.put<Message>(`${this.apiServerUrl}/message/${id}`, message);
    }

    public deleteMessage(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiServerUrl}/message/${id}`);
    }
}

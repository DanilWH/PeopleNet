import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Comment } from "../_domains/comment";
import { environment } from "../../environments/environment";
import { Message } from "../_domains/message";

const apiServerUrl = environment.apiBaseUrl;

@Injectable({
    providedIn: 'root'
})
export class CommentService {
    constructor(private http: HttpClient) { }
    
    public addComment(comment: Comment): Observable<Comment> {
        return this.http.post<Comment>(`${apiServerUrl}/api/comment`, comment);
    }
}

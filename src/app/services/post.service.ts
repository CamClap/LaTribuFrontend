import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, delay } from 'rxjs';
import { Post } from '../models/post.model';
import {User} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private url = environment.backendUrl + '/api/posts';

  constructor(private httpClient: HttpClient) { }

  findAll(q?: string): Observable<Post[]> {
    return this.httpClient.get<Post[]>(this.url, q ? { params: { q: q } } : undefined).pipe(delay(1000));
  }

  private extractId(url: string): string {
    const match = url.match(/\/users\/(\d+)/);
    return match?.[1] ?? '';
  }
  getPostsOfUserGroup(id: number): Observable<Post[]> {
    return this.httpClient.get<Post[]>(`${this.url}?groupOfPost=/api/groups/${id}`)
}


  save(post: Post): Observable<Post> {
    return this.httpClient.post<Post>(this.url, post, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

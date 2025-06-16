import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, delay } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private url = environment.backendUrl + '/posts';

  constructor(private httpClient: HttpClient) { }

  findAll(q?: string): Observable<Post[]> {
    return this.httpClient.get<Post[]>(this.url, q ? { params: { q: q } } : undefined).pipe(delay(1000));
  }

  // getPostsByGroupId(groupId: number): Observable<Post[]> {
  //   return this.httpClient.get<Post[]>(this.url, { params: { groupId: groupId.toString() } });
  // }

  getPostsOfUserGroup(): Observable<Post[]> {
  return this.httpClient.get<Post[]>(`${environment.backendUrl}/posts/group`);
}


  // save(post: Post, file?: File): Observable<Post> {
  //   const formData = new FormData();
  //   formData.append('post', new Blob([JSON.stringify(post)], { type: 'application/json' }));

  //   if (file) {
  //     formData.append('file', file);
  //   }

  //   return this.httpClient.post<Post>(this.url, formData);
  // }

  save(post: Post): Observable<Post> {
    return this.httpClient.post<Post>(this.url, post, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

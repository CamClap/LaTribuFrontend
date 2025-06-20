import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Post } from '../models/post.model';

interface Group {
  id: number;
  name: string;
  users: User[];
  posts: Post[];
}

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private url: string = 'http://localhost:8080/api/groups';

  private currentGroupSubject = new BehaviorSubject<Group | null>(null);
  currentGroup$ = this.currentGroupSubject.asObservable();

  constructor(private httpClient: HttpClient) { }

  getCurrentGroupSync(): Group | null {
    return this.currentGroupSubject.value;
  }

  setCurrentGroup(group: Group) {
    this.currentGroupSubject.next(group);
  }

  findById(id: number): Observable<Group> {
    return this.httpClient.get<Group>(`${this.url}/${id}`);
  }

  save(group: Partial<Group>): Observable<Group> {
    return this.httpClient.post<Group>(this.url, group);
  }

  update(group: Group): Observable<Group> {
    return this.httpClient.put<Group>(`${this.url}/${group.id}`, group);
  }

  deleteById(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Person } from '../models/person.model';
import { Post } from '../models/post.model';

interface Group {
  id: number;
  name: string;
  users: Person[];
  posts: Post[];
}

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private url: string = 'http://localhost:8080/groups';

  // 👉 Le groupe courant est stocké ici (en mémoire + observable)
  private currentGroupSubject = new BehaviorSubject<Group | null>(null);
  currentGroup$ = this.currentGroupSubject.asObservable();

  constructor(private httpClient: HttpClient) { }

  // ✅ Pour récupérer en synchrone (comme connectedPerson.value)
  getCurrentGroupSync(): Group | null {
    return this.currentGroupSubject.value;
  }

  // ✅ Pour modifier le groupe courant (par ex. quand l’utilisateur en sélectionne un)
  setCurrentGroup(group: Group) {
    this.currentGroupSubject.next(group);
  }

  // ✅ Appels backend
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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { Group } from '../models/group.model';

interface User {
  id: number;
  email: string;
  name: string;
  roles: string[];
  password?: string;
  family: Group[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url: string = 'http://localhost:8080/api/users';

  constructor(private httpClient: HttpClient) { }

  isAdmin(user: User): boolean {
    return user.roles?.includes('ROLE_ADMIN') ?? false;
  }

  getAll(): Observable<User[]> {
    return this.httpClient.get<{ member: User[] }>(this.url).pipe(
      map(response => response.member)
    );
  }

  findById(id: number): Observable<User> {
    return this.httpClient.get<User>(`${this.url}/${id}`);
  }

  getGroupsByUserId(userId: number): Observable<Group[]> {
    return this.httpClient.get<Group[]>(`${this.url}/${userId}/groups`);
  }

  getDefaultPhotoForUser(userId: number): string {
    const defaultPhotos = [
      'users-picture/cat.png',
      'users-picture/chicken.png',
      'users-picture/meerkat.png',
      'users-picture/panda.png',
      'users-picture/sheep.png'
    ];
    const index = userId % defaultPhotos.length;
    return defaultPhotos[index];
  }
  extractUserIdFromUrl(url: string): string | null {
    const match = url.match(/\/api\/users\/(\d+)/);
    return match ? match[1] : null;
  }

  getPhotoUrl(user: { id: number, picture?: string }): string {
    return user?.picture
      ? `http://localhost:8080/files/${user.picture}`
      : this.getDefaultPhotoForUser(user.id);
  }

  save(user: Partial<User>): Observable<User> {
    return this.httpClient.post<User>(`${this.url}`, user, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  update(user: Partial<User>, photo?: File): Observable<User> {
  const data = new FormData();
  data.append("user", new Blob([JSON.stringify(user)], { type: "application/json" }));
  if (photo) {
    data.append("photo", photo, photo.name);
  }
  return this.httpClient.put<User>(`${this.url}/${user.id}`, data);
}

  deleteUser(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${id}`);
  }
}

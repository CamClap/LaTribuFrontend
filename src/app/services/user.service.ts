import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from '../models/group.model';

interface User {
  id: number;
  email: string;
  password: string;
  role: Enumerator;
  name: string;
  nickname: string;
  picture: string;
  birthdate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url: string = 'http://localhost:8080/persons';

  constructor(private httpClient: HttpClient) { }


  findAll(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.url);
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

  getPhotoUrl(user: { id: number, picture?: string }): string {
    console.log(user.picture);
    return user?.picture 
      ? `http://localhost:8080/files/${user.picture}` 
      : this.getDefaultPhotoForUser(user.id);
  }
  
  save(user: Partial<User>, photo?: File): Observable<User> {
    const data = new FormData();
    data.append("user", new Blob([JSON.stringify(user)], { type: "application/json" }));
    if (photo) {
      data.append("photo", photo, photo.name);
    }
    return this.httpClient.post<User>(this.url, data);
  }
  

  update(user: Partial<User>, photo?: File): Observable<User> {
  const data = new FormData();
  data.append("user", new Blob([JSON.stringify(user)], { type: "application/json" }));
  if (photo) {
    data.append("photo", photo, photo.name);
  }
  return this.httpClient.put<User>(`${this.url}/${user.id}`, data);
}

  deleteById(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${id}`);
  }
}

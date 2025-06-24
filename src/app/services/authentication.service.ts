import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { JwtPayload, jwtDecode } from 'jwt-decode';

export interface ConnectedUser {
  accessToken: string;
  refreshToken: string;
  id: number;
  name: string;
}

interface JwtResponse {
  accessToken: string;
  refreshToken: string;
}

interface JwtCustomPayload extends JwtPayload {
  email?: string;
  username?: string;
  id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  connectedUser = new BehaviorSubject<ConnectedUser | undefined>(undefined);
  private url = environment.backendUrl + "/auth";

  constructor(private httpClient: HttpClient) { }

  init() {
    const json = localStorage.getItem('user');
    if (json)
      this.connectedUser.next(JSON.parse(json));
  }

  getCurrentPersonSync(): ConnectedUser | undefined {
    return this.connectedUser.value;
  }

  getCurrentPersonId(): number | undefined {
    return this.connectedUser.value?.id;
  }

  getAccessToken(): string | undefined {
    return this.connectedUser.value?.accessToken;
  }

  login(email: string, password: string): Observable<void> {
    return this.httpClient.post<{ token: string }>(this.url, {
      email,
      password,
      grantType: 'password'
    }).pipe(
      tap(res => {
        const decodedAccessToken = jwtDecode<JwtCustomPayload>(res.token);
        const userId = decodedAccessToken.sub ?? decodedAccessToken.id ?? 0;
        const idNumber = typeof userId === 'string' ? parseInt(userId, 10) : userId;


        const user: ConnectedUser = {
          accessToken: res.token,
          refreshToken: '',
          id: idNumber,
          name: decodedAccessToken.username ?? 'utilisateur'
        };
        this.connectedUser.next(user);
        localStorage.setItem('user', JSON.stringify(user));
      }),
      map(() => void 0)
    );
  }

  logout() {
    localStorage.removeItem('user');
    this.connectedUser.next(undefined);
  }
}

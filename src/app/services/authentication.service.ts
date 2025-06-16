import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { JwtPayload, jwtDecode } from 'jwt-decode';


export interface ConnectedPerson {
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
  email: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  connectedPerson = new BehaviorSubject<ConnectedPerson | undefined>(undefined);
  private url = environment.backendUrl + "/authenticate";

  constructor(private httpClient: HttpClient) { }
 
  init() {
    const json = localStorage.getItem('person');
    if (json)
      this.connectedPerson.next(JSON.parse(json));
  }

  getCurrentPersonSync(): ConnectedPerson | undefined {
    return this.connectedPerson.value;
  }
  
  getCurrentPersonId(): number | undefined {
    return this.connectedPerson.value?.id;
  }
  
  getAccessToken(): string | undefined {
    return this.connectedPerson.value?.accessToken;
  }
  
  login(email: string, password: string): Observable<void> {
    return this.httpClient.post<JwtResponse>(this.url, {
      mail: email,
      password: password,
      grantType: 'password'
    }).pipe(
      tap(res => {
        const decodedAccessToken = jwtDecode<JwtCustomPayload>(res.accessToken);
        const person = {
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          id: Number(decodedAccessToken.sub),
          name: decodedAccessToken.email
        };
        this.connectedPerson.next(person);
        localStorage.setItem('person', JSON.stringify(person));
      }),
      map(res => void 0));
  }

  logout() {
    localStorage.removeItem('person');
    this.connectedPerson.next(undefined);
  }

  refresh() {
    return this.httpClient.post<JwtResponse>(this.url, {
      refreshToken: this.connectedPerson.value?.refreshToken,
      grantType: 'refreshToken'
    }).pipe(
      tap(res => {
        const decodedAccessToken = jwtDecode<JwtCustomPayload>(res.accessToken);
        const person = {
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          id: Number(decodedAccessToken.sub),
          name: decodedAccessToken.email
        };
        this.connectedPerson.next(person);
        localStorage.setItem('person', JSON.stringify(person));
      }));
  }

}

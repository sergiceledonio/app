import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    const response = this.http.post(`${this.apiUrl}/auth/register`, user);
    console.log(response);
    return response;
  }

  login(user: any): Observable<any> {
    const response = this.http.post(`${this.apiUrl}/auth/login`, user);
    console.log(response);
    return response;
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LoggedUser {
  id: number;
  name: string;
  artisticName: string;
  email: string;
  password: string;
  phone: string;
  location: string;
  role: string;
  createdAt: Date;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthStoreService {
  private userSubject = new BehaviorSubject<LoggedUser | null>(null);

  public user$: Observable<LoggedUser | null> = this.userSubject.asObservable();

  constructor() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.userSubject.next(JSON.parse(storedUser));
      }
    }
  }

  get user(): LoggedUser | null {
    return this.userSubject.value;
  }

  setUser(user: LoggedUser): void {
    this.userSubject.next(user);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  clear(): void {
    this.userSubject.next(null);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('user');
    }
  }

  loadFromStorage() {
    const user = localStorage.getItem('loggedUser');
    if (user) {
      this.userSubject.next(JSON.parse(user));
    }
  }
}
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
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
    if (this.isBrowser) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  clear(): void {
    this.userSubject.next(null);
    if (this.isBrowser) {
      localStorage.removeItem('user');
    }
  }

  loadFromStorage(): void {
    if (this.isBrowser) {
      const user = localStorage.getItem('user');
      if (user) {
        this.userSubject.next(JSON.parse(user));
      }
    }
  }
}
// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthStoreService } from './auth-store.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authStore: AuthStoreService, private router: Router) {}

  canActivate(): boolean {
    if (this.authStore.user) {
      return true;
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }
}
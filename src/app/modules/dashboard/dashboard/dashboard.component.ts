import { Component, OnInit } from '@angular/core';
import { AuthStoreService, LoggedUser } from '../../../core/services/auth/auth-store.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  constructor(private authStore: AuthStoreService, private router: Router) {}

  userLogged: LoggedUser | null = null;

  ngOnInit() {
    this.userLogged = this.authStore.user;
    console.log(this.userLogged);
  }

  logout() {
    this.authStore.clear();
    this.router.navigate(['/home']);
  }
}

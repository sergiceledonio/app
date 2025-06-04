import { Component, OnInit } from '@angular/core';
import { AuthStoreService, LoggedUser } from '../../../core/services/auth/auth-store.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { NavigationStart } from '@angular/router';

interface Event {
  id: number;
  name: string;
  date: string;
  start: string;
  end: string;
  address: string;
  city: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  [x: string]: any;
  constructor(
    private authStore: AuthStoreService,
    private router: Router,
    private http: HttpClient
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event.navigationTrigger === 'popstate') {
          this.authStore.clear();
        }
      }
    })
  }

  userLogged: LoggedUser | null = null;
  loading: boolean = true;
  events: Event[] = [];

  ngOnInit() {
    this.userLogged = this.authStore.user;
    this.loadEvents();
  }

  loadEvents() {
    if (this.userLogged) {
      console.log(this.userLogged.id);
        this.http.post<Event[]>('http://localhost:3000/events/get-events-by-user', { id: this.userLogged.id })
          .subscribe({
          next: (events) => {
              this.events = events;
              this.loading = false;
              console.log(this.events);
          },
          error: (error) => {
            console.error('Error cargando eventos:', error);
            this.loading = false;
          }
        });
    }
  }

  logout() {
    localStorage.removeItem('user');
    this.authStore.clear();
    this.router.navigate(['/home']);
  }
}

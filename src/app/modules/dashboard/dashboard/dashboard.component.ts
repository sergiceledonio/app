import { Component, OnInit, Renderer2 } from '@angular/core';
import { AuthStoreService, LoggedUser } from '../../../core/services/auth/auth-store.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NavigationStart } from '@angular/router';
import { AddEventModalComponent } from './add-event-modal/add-event-modal.component';

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
  standalone: true,
  imports: [CommonModule, HttpClientModule, AddEventModalComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  [x: string]: any;
  constructor(
    private authStore: AuthStoreService,
    private router: Router,
    private http: HttpClient,
    private renderer: Renderer2
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
  selectedEvent: Event | null = null;
  showModal: boolean = false;
  showAddEventModal: boolean = false;

  ngOnInit() {
    this.userLogged = this.authStore.user;
    this.loadEvents();
  }

  loadEvents() {
    if (this.userLogged) {
        this.http.post<Event[]>('http://localhost:3000/events/get-events-by-user', { id: this.userLogged.id })
          .subscribe({
          next: (events) => {
              this.events = events;
              this.loading = false;
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

  openEventModal(event: Event) {
    this.selectedEvent = event;
    this.toggleBodyScroll(true);
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedEvent = null;
    this.toggleBodyScroll(false);
  }

  deleteEvent(eventId: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este evento?')) {
      this.http.delete(`http://localhost:3000/events/delete-event`, { body: { id: eventId } })
        .subscribe({
          next: () => {
            this.events = this.events.filter(event => event.id !== eventId);
            this.closeModal();
          },
          error: (error) => {
            console.error('Error al eliminar el evento:', error);
          }
        });
    }
  }

  openAddEventModal() {
    this.showAddEventModal = true;
    this.toggleBodyScroll(true);
  }

  closeAddEventModal() {
    this.showAddEventModal = false;
    this.toggleBodyScroll(false);
  }

  toggleBodyScroll(disable: boolean) {
    if (disable) {
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
    } else {
      this.renderer.removeStyle(document.body, 'overflow');
    }
  }

  onEventCreated() {
    this.loadEvents();
  }
}

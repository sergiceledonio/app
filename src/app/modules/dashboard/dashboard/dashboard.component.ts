import { Component, OnInit, Renderer2 } from '@angular/core';
import { AuthStoreService, LoggedUser } from '../../../core/services/auth/auth-store.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NavigationStart } from '@angular/router';
import { AddEventModalComponent } from './add-event-modal/add-event-modal.component';
import { HomeTabComponent } from './home-tab/home-tab.component';
import { EventosTabComponent } from './eventos-tab/eventos-tab.component';
import { CalendarioTabComponent } from './calendario-tab/calendario-tab.component';
import { FinanzasTabComponent } from './finanzas-tab/finanzas-tab.component';
import { ClientesTabComponent } from './clientes-tab/clientes-tab.component';
import { SolicitudesTabComponent } from './solicitudes-tab/solicitudes-tab.component';

interface Event {
  id: number;
  name: string;
  date: string;
  start: string;
  end: string;
  address: string;
  city: string;
  type: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    AddEventModalComponent,
    HomeTabComponent,
    EventosTabComponent,
    CalendarioTabComponent,
    FinanzasTabComponent,
    ClientesTabComponent,
    SolicitudesTabComponent
  ],
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
  activeTab: string = 'home'; // Tab activo por defecto

  // Función para obtener el emoticono según el tipo de evento
  getEventEmoji(type: string): string {
    switch (type?.toLowerCase()) {
      case 'residencia':
        return '🏠';
      case 'discoteca':
        return '🎵';
      case 'evento':
        return '🎉';
      case 'otro':
        return '📅';
      default:
        return '📅';
    }
  }

  ngOnInit() {
    this.userLogged = this.authStore.user;
    this.loadEvents();
  }

  // Método para cambiar el tab activo
  setActiveTab(tabName: string) {
    this.activeTab = tabName;
  }

  // Método para obtener las clases CSS del tab
  getTabClasses(tabName: string): string {
    const isActive = this.activeTab === tabName;
    const baseClasses = 'py-2 px-4 text-sm font-medium rounded-xl border transition-all duration-300 font-rubik flex items-center space-x-2 cursor-pointer';

    if (isActive) {
      return `${baseClasses} text-indigo-600 bg-indigo-100 border-indigo-200 hover:bg-indigo-200`;
    } else {
      return `${baseClasses} text-gray-600 bg-gray-100 border-gray-200 hover:bg-gray-200 hover:text-gray-800`;
    }
  }

  // Método para obtener el componente activo según el tab
  getActiveComponent(): any {
    switch (this.activeTab) {
      case 'eventos':
        return EventosTabComponent;
      case 'calendario':
        return CalendarioTabComponent;
      case 'finanzas':
        return FinanzasTabComponent;
      case 'clientes':
        return ClientesTabComponent;
      case 'solicitudes':
        return SolicitudesTabComponent;
      default:
        this.activeTab = 'home';
    }
  }

  loadEvents() {
    if (this.userLogged) {
      this.http.post<Event[]>('http://localhost:3000/events/get-events-by-user', { id: this.userLogged.id, fromDate: new Date().toISOString() })
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

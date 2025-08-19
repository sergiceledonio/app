import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthStoreService, LoggedUser } from '../../../../core/services/auth/auth-store.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-eventos-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './eventos-tab.component.html'
})
export class EventosTabComponent implements OnInit, AfterViewInit {
  @ViewChild('eventsList') eventsList!: ElementRef;
  @ViewChild('formContainer') formContainer!: ElementRef;

  constructor(
    private http: HttpClient,
    private authStore: AuthStoreService
  ) {}

  events: any[] = [];
  filteredEvents: any[] = [];
  userLogged: LoggedUser | null = null;
  loading: boolean = true;
  activeSubTab: string = 'eventos-pasados'; // Sub-tab activo por defecto

  // Filters
  filters = {
    date: '',
    location: '',
    name: ''
  };

  // Modal properties
  showModal: boolean = false;
  selectedEvent: any = null;
  isEditMode: boolean = false;
  editedEvent: any = {};

  // Snackbar properties
  showSnackbar: boolean = false;
  snackbarMessage: string = '';
  snackbarType: 'success' | 'error' = 'success';

  // Form properties for static card
  eventData = {
    name: '',
    date: '',
    start: '',
    end: '',
    address: '',
    city: '',
    contact: '',
    observations: '',
    price: 0,
    type: '',
    userId: 0
  };
  eventTypes = ['residencia', 'discoteca', 'evento', 'otro'];

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

  ngOnInit(): void {
    this.userLogged = this.authStore.user;
    this.loadEvents();
  }

  ngAfterViewInit(): void {
    this.adjustEventsListHeight();
    // Ajustar altura cuando cambie el tamaño de la ventana
    window.addEventListener('resize', () => {
      this.adjustEventsListHeight();
    });
  }

  adjustEventsListHeight(): void {
    setTimeout(() => {
      if (this.formContainer && this.eventsList) {
        const formHeight = this.formContainer.nativeElement.offsetHeight;
        this.eventsList.nativeElement.style.height = `${formHeight}px`;
      }
    }, 100);
  }

  // Apply filters
  applyFilters(): void {
    this.filteredEvents = this.events.filter(event => {
      let matchesDate = true;
      let matchesLocation = true;
      let matchesName = true;

      // Date filter
      if (this.filters.date) {
        const eventDate = new Date(event.date);
        const filterDate = new Date(this.filters.date);
        matchesDate = eventDate.toDateString() === filterDate.toDateString();
      }

      // Location filter
      if (this.filters.location) {
        const location = this.filters.location.toLowerCase();
        matchesLocation = event.city.toLowerCase().includes(location) ||
                        event.address.toLowerCase().includes(location);
      }

      // Name filter
      if (this.filters.name) {
        const name = this.filters.name.toLowerCase();
        matchesName = event.name.toLowerCase().includes(name);
      }

      return matchesDate && matchesLocation && matchesName;
    });
  }

  // Clear all filters
  clearFilters(): void {
    this.filters = {
      date: '',
      location: '',
      name: ''
    };
    this.filteredEvents = [...this.events];
  }

  // Método para cambiar el sub-tab activo
  setActiveSubTab(subTabName: string) {
    this.activeSubTab = subTabName;
    this.loadEvents();
  }

  // Método para obtener las clases CSS del sub-tab
  getSubTabClasses(subTabName: string): string {
    const isActive = this.activeSubTab === subTabName;
    const baseClasses = 'py-2 px-1 text-sm font-medium transition-all duration-300 cursor-pointer';

    if (isActive) {
      return `${baseClasses} text-indigo-600 border-b-2 border-indigo-600`;
    } else {
      return `${baseClasses} text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300`;
    }
  }

  // Abrir modal en modo ver
  openEventModal(event: any) {
    this.selectedEvent = event;
    this.isEditMode = false;
    this.showModal = true;
  }

  // Abrir modal en modo editar
  openEditModal(event: any) {
    this.selectedEvent = event;
    this.isEditMode = true;
    this.editedEvent = { ...event }; // Copiar el evento para editar
    this.showModal = true;
  }

  // Cerrar modal
  closeModal() {
    this.showModal = false;
    this.selectedEvent = null;
    this.isEditMode = false;
    this.editedEvent = {};
  }

  // Guardar cambios del evento
  saveEvent() {
    if (this.editedEvent) {

      this.http.put(`http://localhost:3000/events/edit-event`, { id: this.selectedEvent.id, event: this.editedEvent })
        .subscribe({
          next: () => {
            this.loadEvents(); // Recargar eventos
            this.closeModal();
            this.showSuccessSnackbar('Evento actualizado correctamente');
          },
          error: (error) => {
            console.error('Error actualizando evento:', error);
            this.showErrorSnackbar('Error al actualizar el evento');
          }
        });
    }
  }

  // Eliminar evento
  deleteEvent(eventId: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este evento?')) {
      this.http.delete(`http://localhost:3000/events/delete-event`, { body: { id: eventId } })
        .subscribe({
          next: () => {
            this.events = this.events.filter(event => event.id !== eventId);
            this.filteredEvents = this.filteredEvents.filter(event => event.id !== eventId);
            this.closeModal();
            this.showSuccessSnackbar('Evento eliminado correctamente');
          },
          error: (error) => {
            console.error('Error al eliminar el evento:', error);
            this.showErrorSnackbar('Error al eliminar el evento');
          }
        });
    }
  }

  loadEvents() {
    if (this.userLogged) {
      if (this.activeSubTab === 'eventos-pasados') {
        this.http.post<Event[]>('http://localhost:3000/events/get-events-by-user', { id: this.userLogged.id, toDate: new Date().toISOString() })
          .subscribe({
          next: (events) => {
              this.events = events;
              this.filteredEvents = [...events];
              this.loading = false;
              this.applyFilters(); // Apply filters after loading events
              this.adjustEventsListHeight();
          },
          error: (error) => {
            console.error('Error cargando eventos:', error);
            this.loading = false;
          }
        });
        return;
      }

      this.http.post<Event[]>('http://localhost:3000/events/get-events-by-user', { id: this.userLogged.id, fromDate: new Date().toISOString() })
        .subscribe({
        next: (events) => {
            this.events = events;
            this.filteredEvents = [...events];
            this.loading = false;
            this.applyFilters(); // Apply filters after loading events
            this.adjustEventsListHeight();
        },
        error: (error) => {
          console.error('Error cargando eventos:', error);
          this.loading = false;
        }
      });
    }
  }

  // Mostrar snackbar de éxito
  showSuccessSnackbar(message: string) {
    this.snackbarMessage = message;
    this.snackbarType = 'success';
    this.showSnackbar = true;

    // Ocultar automáticamente después de 3 segundos
    setTimeout(() => {
      this.showSnackbar = false;
    }, 3000);
  }

  // Mostrar snackbar de error
  showErrorSnackbar(message: string) {
    this.snackbarMessage = message;
    this.snackbarType = 'error';
    this.showSnackbar = true;

    // Ocultar automáticamente después de 4 segundos
    setTimeout(() => {
      this.showSnackbar = false;
    }, 4000);
  }

  // Obtener fecha actual para el input de fecha
  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Crear evento desde el formulario estático
  createEvent() {
    if (this.userLogged) {
      this.eventData.userId = this.userLogged.id;
      this.http.post('http://localhost:3000/events/create-event', this.eventData)
        .subscribe({
          next: () => {
            this.loadEvents(); // Recargar eventos
            this.resetForm();
            this.showSuccessSnackbar('Evento creado correctamente');
          },
          error: (error) => {
            console.error('Error al crear el evento:', error);
            this.showErrorSnackbar('Error al crear el evento');
          }
        });
    }
  }

  // Resetear formulario
  resetForm() {
    this.eventData = {
      name: '',
      date: '',
      start: '',
      end: '',
      address: '',
      city: '',
      contact: '',
      observations: '',
      price: 0,
      type: '',
      userId: 0
    };
    this.eventData.userId = this.userLogged?.id || 0;
  }
}

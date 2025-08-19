import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthStoreService, LoggedUser } from '../../../../core/services/auth/auth-store.service';

interface CalendarDay {
  dayNumber: number;
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: any[];
  eventCount: number;
}

interface CalendarEvent {
  id: number;
  name: string;
  date: string;
  start: string;
  end: string;
  address: string;
  city: string;
  type: string;
  contact: string;
  price: number;
  observations?: string;
}

@Component({
  selector: 'app-calendario-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendario-tab.component.html'
})
export class CalendarioTabComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private authStore: AuthStoreService
  ) {}

  userLogged: LoggedUser | null = null;

  currentDate: Date = new Date();
  currentMonth: number = this.currentDate.getMonth();
  currentYear: number = this.currentDate.getFullYear();
  currentMonthName: string = '';

  calendarDays: CalendarDay[] = [];
  events: CalendarEvent[] = [];

  showEventModal: boolean = false;
  selectedEvent: CalendarEvent | null = null;

  totalEventsThisMonth: number = 0;

  ngOnInit() {
    this.userLogged = this.authStore.user;
    this.updateMonthName();
    this.generateCalendar();
    this.loadEvents();
  }

  updateMonthName() {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    this.currentMonthName = months[this.currentMonth];
  }

  generateCalendar() {
    this.calendarDays = [];

    // Obtener el primer día del mes actual
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);

    // Obtener el último día del mes actual
    const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);

    // Obtener el día de la semana del primer día (0 = domingo, 1 = lunes, etc.)
    let firstDayWeekday = firstDayOfMonth.getDay();
    // Convertir a lunes = 0, domingo = 6
    firstDayWeekday = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;

    // Obtener el día de la semana del último día
    let lastDayWeekday = lastDayOfMonth.getDay();
    lastDayWeekday = lastDayWeekday === 0 ? 6 : lastDayWeekday - 1;

    // Agregar días del mes anterior para completar la primera semana
    const daysFromPreviousMonth = firstDayWeekday;
    const previousMonth = new Date(this.currentYear, this.currentMonth, 0);
    const lastDayPreviousMonth = previousMonth.getDate();

    for (let i = daysFromPreviousMonth - 1; i >= 0; i--) {
      const dayNumber = lastDayPreviousMonth - i;
      const date = new Date(this.currentYear, this.currentMonth - 1, dayNumber);

      this.calendarDays.push({
        dayNumber,
        date,
        isCurrentMonth: false,
        isToday: this.isToday(date),
        events: [],
        eventCount: 0
      });
    }

    // Agregar días del mes actual
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(this.currentYear, this.currentMonth, day);

      this.calendarDays.push({
        dayNumber: day,
        date,
        isCurrentMonth: true,
        isToday: this.isToday(date),
        events: [],
        eventCount: 0
      });
    }

    // Agregar días del mes siguiente para completar la última semana
    const daysFromNextMonth = 6 - lastDayWeekday;
    for (let day = 1; day <= daysFromNextMonth; day++) {
      const date = new Date(this.currentYear, this.currentMonth + 1, day);

      this.calendarDays.push({
        dayNumber: day,
        date,
        isCurrentMonth: false,
        isToday: this.isToday(date),
        events: [],
        eventCount: 0
      });
    }

    this.assignEventsToDays();
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  loadEvents() {
    if (!this.userLogged) {
      this.assignEventsToDays();
      return;
    }

    // Calcular las fechas del mes seleccionado
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);

    // Formatear fechas para el backend (YYYY-MM-DD)
    const fromDate = firstDayOfMonth.toISOString().split('T')[0];
    const toDate = lastDayOfMonth.toISOString().split('T')[0];

    // Llamada al endpoint del backend
    this.http.post<CalendarEvent[]>('http://localhost:3000/events/get-events-by-user', {
      id: this.userLogged.id,
      fromDate: fromDate,
      toDate: toDate
    }).subscribe({
      next: (events) => {
        this.events = events;
        this.assignEventsToDays();
      },
      error: (error) => {
        console.error('Error cargando eventos del mes:', error);
        this.events = [];
        this.assignEventsToDays();
      }
    });
  }

  assignEventsToDays() {
    // Limpiar eventos de todos los días
    this.calendarDays.forEach(day => {
      day.events = [];
      day.eventCount = 0;
    });

    // Asignar eventos a los días correspondientes
    this.events.forEach(event => {
      const eventDate = new Date(event.date);

      const dayIndex = this.calendarDays.findIndex(day =>
        day.date.getDate() === eventDate.getDate() &&
        day.date.getMonth() === eventDate.getMonth() &&
        day.date.getFullYear() === eventDate.getFullYear()
      );

      if (dayIndex !== -1) {
        this.calendarDays[dayIndex].events.push(event);
        this.calendarDays[dayIndex].eventCount++;
      }
    });

    this.calculateTotalEventsThisMonth();
  }

  calculateTotalEventsThisMonth() {
    this.totalEventsThisMonth = this.calendarDays
      .filter(day => day.isCurrentMonth)
      .reduce((total, day) => total + day.eventCount, 0);
  }

  previousMonth() {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.updateMonthName();
    this.generateCalendar();
    this.loadEvents(); // Cargar eventos del nuevo mes
  }

  nextMonth() {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.updateMonthName();
    this.generateCalendar();
    this.loadEvents(); // Cargar eventos del nuevo mes
  }

  openEventModal(event: CalendarEvent) {
    this.selectedEvent = event;
    this.showEventModal = true;
  }

  closeEventModal() {
    this.showEventModal = false;
    this.selectedEvent = null;
  }

  addEventToDay(day: CalendarDay) {
    // Aquí se podría abrir un modal para crear un nuevo evento
    // Por ahora, solo mostraremos un console.log
    console.log('Agregar evento para el día:', day.date);

    // En una implementación real, esto abriría un modal similar al de eventos-tab
    // con la fecha pre-seleccionada
  }
}

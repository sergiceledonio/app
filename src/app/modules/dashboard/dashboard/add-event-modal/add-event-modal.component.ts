import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Renderer2 } from '@angular/core';

@Component({
  selector: 'app-add-event-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-event-modal.component.html'
})
export class AddEventModalComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() userId: number | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() eventCreated = new EventEmitter<void>();

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

  // Snackbar properties
  showSnackbar: boolean = false;
  snackbarMessage: string = '';
  snackbarType: 'success' | 'error' = 'success';

  constructor(private http: HttpClient, private renderer: Renderer2) {}

  ngOnInit() {
    this.eventData.userId = this.userId || 0;
    if (this.isOpen) {
      this.toggleBodyScroll(true);
    }
  }

  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onClose() {
    this.closeModal.emit();
    this.toggleBodyScroll(false);
  }

  ngOnChanges() {
    if (this.isOpen) {
      this.toggleBodyScroll(true);
      // Resetear el formulario cuando se abre el modal
      this.resetForm();
    } else {
      this.toggleBodyScroll(false);
    }
  }

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
    this.eventData.userId = this.userId || 0;
  }

  toggleBodyScroll(disable: boolean) {
    if (disable) {
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
    } else {
      this.renderer.removeStyle(document.body, 'overflow');
    }
  }

  onSubmit() {
    if (this.userId) {
      this.http.post('http://localhost:3000/events/create-event', this.eventData)
      .subscribe({
        next: () => {
          this.eventCreated.emit();
          this.resetForm();
          this.closeModal.emit();
          this.showSuccessSnackbar('Evento creado correctamente');
        },
        error: (error) => {
          console.error('Error al crear el evento:', error);
          this.showErrorSnackbar('Error al crear el evento');
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
}

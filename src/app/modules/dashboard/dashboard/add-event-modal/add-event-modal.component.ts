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

  constructor(private http: HttpClient, private renderer: Renderer2) {}

  ngOnInit() {
    this.eventData.userId = this.userId || 0;
    if (this.isOpen) {
      this.toggleBodyScroll(true);
    }
  }

  onClose() {
    this.closeModal.emit();
    this.toggleBodyScroll(false);
  }

  ngOnChanges() {
    if (this.isOpen) {
      this.toggleBodyScroll(true);
    } else {
      this.toggleBodyScroll(false);
    }
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
          this.closeModal.emit();
        },
        error: (error) => {
          console.error('Error al crear el evento:', error);
        }
      });
    }
  }
}

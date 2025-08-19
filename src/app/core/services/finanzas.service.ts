import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Transaccion {
  amount: number;
  method: string;
  status: string;
  description: string;
  reference: string;
  date: string;
  userId: number;
  eventId: number;
}

export interface FindOneParams {
  id: number;
  fromDate?: string;
  toDate?: string;
}

export interface SavePaymentDto {
  amount: number;
  method: string;
  status: string;
  description: string;
  reference: string;
  date: string;
  userId: number;
  eventId: number;
}

@Injectable({
  providedIn: 'root'
})
export class FinanzasService {

  private apiUrl = 'http://localhost:3000/payments';

  constructor(private http: HttpClient) {}

  // Obtener todas las transacciones
  getTransacciones(): Observable<Transaccion[]> {
    return this.http.get<Transaccion[]>(`${this.apiUrl}`);
  }

  // Crear nueva transacción
  crearTransaccion(transaccion: Omit<Transaccion, 'id'>): Observable<Transaccion> {
    return this.http.post<Transaccion>(`${this.apiUrl}/create-payment`, transaccion);
  }

  // Obtener transacción por ID
  getTransaccionById(id: number): Observable<Transaccion> {
    return this.http.post<Transaccion>(`${this.apiUrl}/get-payment`, { id });
  }

  // Obtener transacciones por usuario
  getTransaccionesPorUsuario(userId: number, fromDate?: Date, toDate?: Date): Observable<Transaccion[]> {
    const params: FindOneParams = { id: userId };
    if (fromDate) params.fromDate = fromDate.toISOString();
    if (toDate) params.toDate = toDate.toISOString();
    return this.http.post<Transaccion[]>(`${this.apiUrl}/get-payments-by-user`, params);
  }

  // Obtener transacciones por evento
  getTransaccionesPorEvento(eventId: number, fromDate?: Date, toDate?: Date): Observable<Transaccion[]> {
    const params: FindOneParams = { id: eventId };
    if (fromDate) params.fromDate = fromDate.toISOString();
    if (toDate) params.toDate = toDate.toISOString();
    return this.http.post<Transaccion[]>(`${this.apiUrl}/get-payments-by-event`, params);
  }

  // Actualizar transacción
  actualizarTransaccion(id: number, transaccion: SavePaymentDto): Observable<Transaccion> {
    return this.http.put<Transaccion>(`${this.apiUrl}/edit-payment`, { id, payment: transaccion });
  }

  // Eliminar transacción
  eliminarTransaccion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-payment`, { body: { id } });
  }
}

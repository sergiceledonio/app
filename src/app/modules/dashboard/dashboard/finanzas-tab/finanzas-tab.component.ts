import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanzasService, Transaccion } from '../../../../core/services/finanzas.service';
import { catchError, forkJoin, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthStoreService, LoggedUser } from '../../../../core/services/auth/auth-store.service';

// Interfaces locales para el componente
interface MetricaFinanciera {
  ingresosTotales: number;
  gastosTotales: number;
  balance: number;
  margenBeneficio: number;
  gastosPorCategoria: { [key: string]: number };
  ingresosPorMes: { [key: string]: number };
}

interface FinanzasEvent {
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
  selector: 'app-finanzas-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './finanzas-tab.component.html'
})
export class FinanzasTabComponent implements OnInit {

  constructor(
    private finanzasService: FinanzasService,
    private http: HttpClient,
    private authStore: AuthStoreService
  ) {}

  userLogged: LoggedUser | null = null;

  transacciones: Transaccion[] = [];
  cobrosPendientes: Transaccion[] = [];
  eventosMesActual: any[] = [];
  metricas: MetricaFinanciera = {
    ingresosTotales: 0,
    gastosTotales: 0,
    balance: 0,
    margenBeneficio: 0,
    gastosPorCategoria: {},
    ingresosPorMes: {}
  };

  events: FinanzasEvent[] = [];
  // Propiedad para usar Object.keys en el template
  Object = Object;

  currentDate: Date = new Date();
  currentMonth: number = this.currentDate.getMonth();
  currentYear: number = this.currentDate.getFullYear();

  // Estados de carga
  cargando = true;
  error = false;
  mensajeError = '';

  ngOnInit() {
    this.userLogged = this.authStore.user;
    this.loadEvents();
    this.cargarDatosDesdeBackend();
  }

  cargarDatosDesdeBackend() {
    this.cargando = true;
    this.error = false;

    // Verificar que tenemos un usuario válido
    const userId = 1; // ID por defecto

    // Cargar transacciones y eventos en paralelo
    forkJoin({
      transacciones: this.finanzasService.getTransacciones().pipe(
        catchError(error => {
          console.error('Error al cargar transacciones:', error);
          return of([]);
        })
      )
    }).subscribe({
      next: (resultado) => {
        this.transacciones = resultado.transacciones || [];
        this.cobrosPendientes = this.transacciones.filter(t => t.status === 'pending');

        this.calcularMetricas();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error general al cargar datos:', error);
        this.error = true;
        this.mensajeError = 'Error al cargar los datos financieros. Por favor, inténtalo de nuevo.';
        this.cargando = false;
      }
    });
  }

    calcularMetricas() {
    // Para el sistema de pagos, consideramos todos como ingresos
    const ingresos = this.transacciones.filter(t => t.status === 'completed');
    const gastos = this.transacciones.filter(t => t.amount < 0);

        // Validar que amount sea un número válido antes de sumar
    this.metricas.ingresosTotales = ingresos.reduce((sum, t) => {
      const amount = Number(t.amount) || 0;
      return sum + amount;
    }, 0);

    this.metricas.gastosTotales = gastos.reduce((sum, t) => {
      const amount = Number(t.amount) || 0;
      return sum + amount;
    }, 0);

    this.metricas.balance = this.metricas.ingresosTotales - this.metricas.gastosTotales;
    this.metricas.margenBeneficio = this.metricas.ingresosTotales > 0
      ? (this.metricas.balance / this.metricas.ingresosTotales) * 100
      : 0;



    // Calcular gastos por método de pago
    this.metricas.gastosPorCategoria = {};
    gastos.forEach(gasto => {
      const amount = Number(gasto.amount) || 0;
      if (this.metricas.gastosPorCategoria[gasto.method]) {
        this.metricas.gastosPorCategoria[gasto.method] += amount;
      } else {
        this.metricas.gastosPorCategoria[gasto.method] = amount;
      }
    });

    // Calcular ingresos por mes
    this.metricas.ingresosPorMes = {};
    ingresos.forEach(ingreso => {
      const amount = Number(ingreso.amount) || 0;
      const fecha = this.validarFecha(ingreso.date);
      const mes = fecha.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
      if (this.metricas.ingresosPorMes[mes]) {
        this.metricas.ingresosPorMes[mes] += amount;
      } else {
        this.metricas.ingresosPorMes[mes] = amount;
      }
    });
  }

  obtenerTransaccionesRecientes(): Transaccion[] {
    return this.transacciones.filter(t => t.status === 'completed')
      .sort((a, b) => {
        const dateA = this.validarFecha(a.date).getTime();
        const dateB = this.validarFecha(b.date).getTime();
        return dateB - dateA;
      })
      .slice(0, 5);
  }

  obtenerCobrosPendientes(): Transaccion[] {
    return this.cobrosPendientes.filter(t => t.status === 'pending')
      .sort((a, b) => {
        const dateA = this.validarFecha(a.date).getTime();
        const dateB = this.validarFecha(b.date).getTime();
        return dateB - dateA;
      })
      .slice(0, 5);
  }

  obtenerTotalCobrosPendientes(): number {
    return this.cobrosPendientes.reduce((sum, cobro) => {
      const amount = Number(cobro.amount) || 0;
      return sum + amount;
    }, 0);
  }

  obtenerClaseEstado(estado: string): string {
    switch (estado) {
      case 'vencido': return 'bg-red-100 text-red-800 border-red-200';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'proximo': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  obtenerClasePrioridad(prioridad: string): string {
    switch (prioridad) {
      case 'alta': return 'bg-red-500';
      case 'media': return 'bg-yellow-500';
      case 'baja': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  }

  obtenerDiasRestantes(fecha: Date | string): number {
    if (!fecha) return 0;

    try {
      const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
      const hoy = new Date();
      const diffTime = fechaObj.getTime() - hoy.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch (error) {
      console.error('Error al calcular días restantes:', error);
      return 0;
    }
  }

  formatearMoneda(monto: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(monto);
  }

  formatearPorcentaje(valor: number): string {
    return `${valor.toFixed(1)}%`;
  }

  obtenerColorBalance(): string {
    return this.metricas.balance >= 0 ? 'text-green-600' : 'text-red-600';
  }

  obtenerIconoBalance(): string {
    return this.metricas.balance >= 0 ? '📈' : '📉';
  }

  // Método para obtener el total de pagos pendientes
  obtenerTotalPendiente(): number {
    return this.cobrosPendientes.reduce((sum, transaccion) => {
      const amount = Number(transaccion.amount) || 0;
      return sum + amount;
    }, 0);
  }

    // Método para obtener la estimación de ingresos del mes actual basada en eventos
  obtenerAproximacionMesActual(): number {
    // Estimación basada en eventos programados
    const estimacionEventos = this.events.reduce((total, evento) => {
      console.log(evento);
      // Asumiendo que cada evento tiene un precio estimado
      // Puedes ajustar esta lógica según la estructura de tus eventos
      const precioEstimado = evento.price;
      return total + Number(precioEstimado);
    }, 0);



    return estimacionEventos;
  }

  loadEvents() {
    if (!this.userLogged) {
      return;
    }

    // Calcular las fechas del mes seleccionado
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);

    // Formatear fechas para el backend (YYYY-MM-DD)
    const fromDate = firstDayOfMonth.toISOString().split('T')[0];
    const toDate = lastDayOfMonth.toISOString().split('T')[0];

    // Llamada al endpoint del backend
    this.http.post<FinanzasEvent[]>('http://localhost:3000/events/get-events-by-user', {
      id: this.userLogged.id,
      fromDate: fromDate,
      toDate: toDate
    }).subscribe({
      next: (events) => {
        this.events = events;
      },
      error: (error) => {
        console.error('Error cargando eventos del mes:', error);
        this.events = [];
      }
    });
  }

  // Método para recargar datos
  recargarDatos() {
    this.cargarDatosDesdeBackend();
  }

    // Método para manejar errores de red
  manejarError(error: any): void {
    console.error('Error en operación:', error);
    this.error = true;
    this.mensajeError = 'Error de conexión. Verifica tu conexión a internet e inténtalo de nuevo.';
  }



  // Método de utilidad para validar fechas
  private validarFecha(fecha: any): Date {
    if (!fecha) return new Date();

    try {
      const fechaObj = new Date(fecha);
      return isNaN(fechaObj.getTime()) ? new Date() : fechaObj;
    } catch (error) {
      console.error('Error al validar fecha:', error, fecha);
      return new Date();
    }
  }
}

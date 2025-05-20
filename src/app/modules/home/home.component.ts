import { Component } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [CommonModule, HttpClientModule, FormsModule],
  providers: [ApiService]
})
export class HomeComponent {
  isRegister: boolean = false;
  user = {
    email: '',
    password: ''
  };

  constructor(private apiService: ApiService) {}

  toggleForm(isRegister: boolean) {
    this.isRegister = isRegister;
  }

  onSubmit() {
    // if (this.isRegister) {
    //   // Lógica para registro
    //   this.apiService.register(this.user).subscribe(
    //     (response) => {
    //       console.log('Usuario registrado:', response);
    //       // Aquí puedes agregar la lógica para redirigir o mostrar mensaje de éxito
    //     },
    //     (error) => {
    //       console.error('Error en el registro:', error);
    //       // Aquí puedes agregar la lógica para mostrar mensaje de error
    //     }
    //   );
    // } else {
    //   // Lógica para inicio de sesión
    //   this.apiService.login(this.user).subscribe(
    //     (response) => {
    //       console.log('Usuario autenticado:', response);
    //       // Aquí puedes agregar la lógica para redirigir o mostrar mensaje de éxito
    //     },
    //     (error) => {
    //       console.error('Error en el inicio de sesión:', error);
    //       // Aquí puedes agregar la lógica para mostrar mensaje de error
    //     }
    //   );
    // }
  }
}


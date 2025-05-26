import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [CommonModule, HttpClientModule, FormsModule],
  providers: [AuthService]
})
export class HomeComponent {
  isRegister: boolean = false;
  userlogin = {
    email: '',
    password: ''
  };

  userregister = {
    name: '',
    email: '',
    password: '',
    phone: '',
    role: '',
    createdAt: new Date()
  };

  isLoggedIn: boolean = false;
  isRegisterSuccess: boolean = false;

  constructor(private authService: AuthService) {}

  toggleForm(isRegister: boolean) {
    this.isRegister = isRegister;
  }

  onRegisterSubmit() {
    // Lógica para inicio de sesión
    this.authService.register(this.userregister).subscribe(
      (response) => {
        console.log('Usuario registrado:', response);
        // Aquí puedes agregar la lógica para redirigir o mostrar mensaje de éxito
      },
      (error) => {
        console.error('Error en el registro:', error);
        // Aquí puedes agregar la lógica para mostrar mensaje de error
    });
  }

  onLoginSubmit() {
    this.authService.login(this.userlogin).subscribe(
      (response) => {
        console.log('Usuario autenticado:', response);
        // Aquí puedes agregar la lógica para redirigir o mostrar mensaje de éxito
      },
      (error) => {
        console.error('Error en la autenticación:', error);
        // Aquí puedes agregar la lógica para mostrar mensaje de error
    });
  }
}


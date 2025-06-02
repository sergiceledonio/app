import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStoreService } from '../../core/services/auth/auth-store.service'
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
    artistic_name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    role: '',
  };

  isLoggedIn: boolean = false;
  isRegisterFailed: boolean = false;

  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router, private authStore: AuthStoreService) {}

  toggleForm(isRegister: boolean) {
    this.isRegister = isRegister;
    this.isRegisterFailed = false;
    this.isLoggedIn = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  onRegisterSubmit() {
    console.log(this.userregister);
    this.authService.register(this.userregister).subscribe(
      (response) => {
        if (response) {
          this.toggleForm(false);
          this.successMessage = 'Usuario registrado correctamente';
          this.userlogin = {
            email: response.email,
            password: response.password
          };
        } else {
          this.isRegisterFailed = true;
          this.errorMessage = 'Usuario ya registrado';
        }
      },
      (error) => {
        console.log(error);
        this.isRegisterFailed = true;
        this.errorMessage = 'Revisa que los campos estén correctos';
      }
    );
  }

  onLoginSubmit() {
    this.authService.login(this.userlogin).subscribe(
      (response) => {
        if (response) {
          this.authStore.setUser(response);
          this.isLoggedIn = true;
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Usuario o contraseña incorrectos';
        }
      },
      (error) => {
        console.log(error);
        this.isLoggedIn = false;
    });
  }
}


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { AuthService } from '../../core/services/auth/auth.service';
import { DashboardComponent } from '../dashboard/dashboard/dashboard.component';
@NgModule({
  declarations: [HomeComponent, DashboardComponent],
  imports: [
    CommonModule
  ],
  exports: [HomeComponent],
  providers: [AuthService]
})
export class HomeModule { }

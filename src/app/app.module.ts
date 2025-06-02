import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeModule } from './modules/home/home.module';
import { AppComponent } from './app.component';
import { AuthService } from './core/services/auth/auth.service';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { DashboardModule } from './modules/dashboard/dashboard/dashboard.module';
@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    HomeModule,
    AppRoutingModule,
    RouterModule,
    DashboardModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent],
})
export class AppModule { }

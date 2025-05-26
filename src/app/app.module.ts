import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeModule } from './modules/home/home.module';
import { AppComponent } from './app.component';
import { AuthService } from './core/services/auth/auth.service';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    HomeModule,
    AppRoutingModule,
    RouterModule,
  ],
  providers: [AuthService],
  bootstrap: [AppComponent],
})
export class AppModule { }

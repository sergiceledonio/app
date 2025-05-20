import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { ApiService } from '../../core/services/api.service';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule
  ],
  exports: [HomeComponent],
  providers: [ApiService]
})
export class HomeModule { }

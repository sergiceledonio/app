import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeModule } from './modules/home/home.module';
import { AppComponent } from './app.component';
import { ApiService } from './core/services/api.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    HomeModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }

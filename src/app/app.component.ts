import { Component } from '@angular/core';
import { HomeComponent } from './modules/home/home.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [HomeComponent],
})
export class AppComponent {
  title = 'app';
}

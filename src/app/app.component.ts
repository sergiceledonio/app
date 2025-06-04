import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthStoreService } from './core/services/auth/auth-store.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RouterModule],
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor(private authStore: AuthStoreService) {}

  ngOnInit(): void {
    this.authStore.loadFromStorage();
  }
}

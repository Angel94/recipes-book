import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  private userSub: Subscription;

  constructor(private dataStorage: DataStorageService, private authService: AuthService) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user: User) => {
      this.isAuthenticated = !!user;
    });
  }

  onLogout() {
    this.authService.logout();
  }

  onSaveData() {
    this.dataStorage.storeRecipe();
  }

  onFetchData() {
    this.dataStorage.fetchRecipes().subscribe();
  }
}

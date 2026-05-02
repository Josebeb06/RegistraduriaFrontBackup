import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '../../../shared/services/auth-state.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(
    private authService: AuthStateService,
    private router: Router,
  ) {}

  canActivate: CanActivateFn = () => {
    if (!this.authService.isAuthenticated() || 
        this.authService.isTokenExpired()) {
      this.authService.logout();
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  };
}
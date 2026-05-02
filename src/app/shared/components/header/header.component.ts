import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthStateService } from '../../services/auth-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  userName: string | null = null;
  userType: string | null = null;
  private subscription: Subscription | null = null;

  constructor(
    private authService: AuthStateService,
    private router: Router,
  ) {}

  ngOnInit() {
    // Suscribirse al observable de usuario
    this.subscription = this.authService.user$.subscribe((user) => {
      this.isAuthenticated = !!user;
      this.userName = user?.usuario || user?.username || null;
      this.userType = user?.tipo || null;
    });

    // Escuchar cambios de auth desde otros tabs/windows
    window.addEventListener('authChange', () => this.updateAuthState());
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    window.removeEventListener('authChange', () => this.updateAuthState());
  }

  private updateAuthState() {
    const user = this.authService.currentUser();
    this.isAuthenticated = !!user;
    this.userName = user?.usuario || user?.username || null;
    this.userType = user?.tipo || null;
  }

  onLogout() {
    if (confirm('¿Desea cerrar sesión?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }

  getTypeLabel(): string {
    switch (this.userType) {
      case 'registrador':
        return 'Registrador';
      case 'consejo':
        return 'Consejo Nacional';
      case 'admin':
        return 'Administrador Electoral';
      default:
        return 'Usuario';
    }
  }
}
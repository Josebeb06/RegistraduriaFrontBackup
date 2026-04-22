import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  usuario = '';
  password = '';

  loading = false;

  // Toast
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showToast = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  onLogin() {
    if (!this.usuario || !this.password) {
      this.showError('Debe ingresar usuario y contraseña');
      return;
    }

    this.loading = true;

    this.authService
      .login({
        usuario: this.usuario,
        password: this.password,
      })
      .subscribe({
        next: (res) => {
          // Guardar sesión básica (temporal)
          localStorage.setItem('user', JSON.stringify(res));
          window.dispatchEvent(new Event('authChange'));

          this.showSuccess('Inicio de sesión exitoso');

          setTimeout(() => {
            this.router.navigate(['/']); // o dashboard
          }, 1000);

          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.showError('Credenciales incorrectas');
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }

  private showSuccess(msg: string) {
    this.toastMessage = msg;
    this.toastType = 'success';
    this.showToast = true;
  }

  private showError(msg: string) {
    this.toastMessage = msg;
    this.toastType = 'error';
    this.showToast = true;
  }

  onCloseToast() {
    this.showToast = false;
    this.cdr.detectChanges();
  }
}
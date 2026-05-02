import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStateService } from '../../../../shared/services/auth-state.service';
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
  tipoUsuario: 'registrador' | 'consejo' | 'admin' = 'registrador';

  loading = false;

  // Toast
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showToast = false;

  constructor(
    private authService: AuthStateService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  onLogin() {
    if (!this.usuario || !this.password) {
      this.showError('Debe ingresar usuario y contraseña');
      return;
    }

    this.loading = true;

    let loginObservable;

    if (this.tipoUsuario === 'registrador') {
      loginObservable = this.authService.loginRegistrador(this.usuario, this.password);
    } else if (this.tipoUsuario === 'consejo') {
      loginObservable = this.authService.loginConsejoNacional(this.usuario, this.password);
    } else if (this.tipoUsuario === 'admin') {
      loginObservable = this.authService.loginAdministrador(this.usuario, this.password);
    }

    loginObservable!.subscribe({
      next: () => {
        this.showSuccess(`Inicio de sesión exitoso como ${this.tipoUsuario}`);

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error en login:', err);
        
        let errorMessage = 'Error desconocido';
        
        if (err.status === 401) {
          errorMessage = 'Credenciales incorrectas';
        } else if (err.status === 400) {
          errorMessage = 'Datos inválidos. Verifique usuario y contraseña';
        } else if (err.status === 500) {
          errorMessage = 'Error del servidor. Intente más tarde';
        } else if (err.status === 0) {
          errorMessage = 'No se puede conectar al servidor';
        }
        
        this.showError(errorMessage);
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
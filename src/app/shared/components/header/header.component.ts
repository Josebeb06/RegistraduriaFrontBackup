import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  menuOpen = false;
  isLogged = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkSession();

    // Escuchar cambios de login
    window.addEventListener('authChange', () => {
      this.checkSession();
    });
  }

  checkSession() {
    const user = localStorage.getItem('user');
    this.isLogged = !!user;
  }

  handleAuthAction() {
    if (this.isLogged) {
      // 🔴 LOGOUT
      localStorage.removeItem('user');
      this.isLogged = false;

      this.router.navigateByUrl('/');
    } else {
      // 🟢 LOGIN
      this.router.navigateByUrl('/login');
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }
}
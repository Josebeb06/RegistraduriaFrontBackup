import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-registrador',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-registrador.component.html',
  styleUrls: ['./dashboard-registrador.component.scss'],
})
export class DashboardRegistradorComponent {}

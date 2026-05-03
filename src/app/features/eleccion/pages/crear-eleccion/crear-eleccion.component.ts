import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EleccionService } from '../../services/eleccion.service';

@Component({
  selector: 'app-crear-eleccion',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './crear-eleccion.component.html',
  styleUrls: ['./crear-eleccion.component.scss'],
})
export class CrearEleccionComponent {
  // ── Formulario ────────────────────────────────────────────────
  eleccionForm: FormGroup;

  // ── Checkboxes fuera del form reactivo ───────────────────────
  votoUrna = false;
  votoDomicilio = false;

  // ── Días seleccionados ────────────────────────────────────────
  selectedUrnaDays: Date[] = [];
  selectedDomicilioDays: Date[] = [];

  // ── Calendarios ───────────────────────────────────────────────
  weekdays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  currentMonthUrna: Date = new Date();
  currentMonthDomicilio: Date = new Date();
  calendarDaysUrna: (Date | null)[] = [];
  calendarDaysDomicilio: (Date | null)[] = [];

  // ── Estados ───────────────────────────────────────────────────
  loading = false;
  showSummary = false;
  successMessage = '';
  errorMessage = '';
  errorUrna = '';
  errorDomicilio = '';

  // ── Resumen ───────────────────────────────────────────────────
  summary: any = {};

  // ── Tipos de elección (para mostrar label en resumen) ─────────
  tiposEleccion: any = {
    CONGRESO: 'Elecciones de Congreso',
    PRESIDENCIAL: 'Elecciones de Presidencia',
    GOBERNADORES: 'Elecciones de Gobernadores',
    ALCALDES: 'Elecciones de Alcaldes',
    CONCEJOS: 'Elecciones de Concejos Municipales',
    ASAMBLEA: 'Elecciones de Asambleas Departamentales',
    JUNTAS: 'Elecciones de Juntas Administradoras Locales',
  };

  constructor(
    private fb: FormBuilder,
    private eleccionService: EleccionService,
    public cdr: ChangeDetectorRef,
  ) {
    this.eleccionForm = this.fb.group(
      {
        nombre: ['', [Validators.required, Validators.minLength(5)]],
        tipo: ['', Validators.required],
        fechaInicio: ['', Validators.required],
        fechaFinalizacion: ['', Validators.required],
        listaAbierta: [false],
        idRegistrador: [1],
      },
      { validators: this.validarFechas },
    );

    this.currentMonthUrna = new Date();
    this.currentMonthDomicilio = new Date();
  }

  // ── Getters del form ──────────────────────────────────────────
  get nombre() {
    return this.eleccionForm.get('nombre');
  }
  get tipo() {
    return this.eleccionForm.get('tipo');
  }
  get fechaInicio() {
    return this.eleccionForm.get('fechaInicio');
  }
  get fechaFinalizacion() {
    return this.eleccionForm.get('fechaFinalizacion');
  }

  // ── Validador de fechas ───────────────────────────────────────
  validarFechas(group: AbstractControl) {
    const inicio = group.get('fechaInicio')?.value;
    const fin = group.get('fechaFinalizacion')?.value;
    if (inicio && fin && new Date(fin) <= new Date(inicio)) {
      return { fechasInvalidas: true };
    }
    return null;
  }

  // ── Al cambiar fechas, regenerar calendarios ──────────────────
  onFechaChange() {
    if (this.votoUrna) this.buildCalendar('urna');
    if (this.votoDomicilio) this.buildCalendar('domicilio');
    this.cdr.detectChanges();
  }

  onVotoUrnaChange() {
    if (this.votoUrna) {
      this.buildCalendar('urna');
    } else {
      this.selectedUrnaDays = [];
      this.errorUrna = '';
    }
    this.cdr.detectChanges();
  }

  onVotoDomicilioChange() {
    if (this.votoDomicilio) {
      this.buildCalendar('domicilio');
    } else {
      this.selectedDomicilioDays = [];
      this.errorDomicilio = '';
    }
    this.cdr.detectChanges();
  }

  // ── Calendario: construir días del mes ────────────────────────
  buildCalendar(type: 'urna' | 'domicilio') {
    const month = type === 'urna' ? this.currentMonthUrna : this.currentMonthDomicilio;
    const year = month.getFullYear();
    const m = month.getMonth();

    const firstDay = new Date(year, m, 1).getDay();
    const daysInMonth = new Date(year, m + 1, 0).getDate();

    const days: (Date | null)[] = [];

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, m, i));

    if (type === 'urna') this.calendarDaysUrna = days;
    else this.calendarDaysDomicilio = days;
  }

  prevMonth(type: 'urna' | 'domicilio') {
    if (type === 'urna') {
      this.currentMonthUrna = new Date(
        this.currentMonthUrna.getFullYear(),
        this.currentMonthUrna.getMonth() - 1,
        1,
      );
      this.buildCalendar('urna');
    } else {
      this.currentMonthDomicilio = new Date(
        this.currentMonthDomicilio.getFullYear(),
        this.currentMonthDomicilio.getMonth() - 1,
        1,
      );
      this.buildCalendar('domicilio');
    }
    this.cdr.detectChanges();
  }

  nextMonth(type: 'urna' | 'domicilio') {
    if (type === 'urna') {
      this.currentMonthUrna = new Date(
        this.currentMonthUrna.getFullYear(),
        this.currentMonthUrna.getMonth() + 1,
        1,
      );
      this.buildCalendar('urna');
    } else {
      this.currentMonthDomicilio = new Date(
        this.currentMonthDomicilio.getFullYear(),
        this.currentMonthDomicilio.getMonth() + 1,
        1,
      );
      this.buildCalendar('domicilio');
    }
    this.cdr.detectChanges();
  }

  getMonthLabel(type: 'urna' | 'domicilio'): string {
    const month = type === 'urna' ? this.currentMonthUrna : this.currentMonthDomicilio;
    return month
      .toLocaleString('es-CO', { month: 'long', year: 'numeric' })
      .replace(/^\w/, (c) => c.toUpperCase());
  }

  isInRange(day: Date): boolean {
    const inicio = this.eleccionForm.get('fechaInicio')?.value;
    const fin = this.eleccionForm.get('fechaFinalizacion')?.value;
    if (!inicio || !fin) return true;
    return day >= new Date(inicio + 'T00:00:00') && day <= new Date(fin + 'T00:00:00');
  }

  isSelected(day: Date, type: 'urna' | 'domicilio'): boolean {
    const list = type === 'urna' ? this.selectedUrnaDays : this.selectedDomicilioDays;
    return list.some((d) => d.toDateString() === day.toDateString());
  }

  toggleDay(day: Date, type: 'urna' | 'domicilio') {
    if (!this.isInRange(day)) return;
    const list = type === 'urna' ? this.selectedUrnaDays : this.selectedDomicilioDays;
    const idx = list.findIndex((d) => d.toDateString() === day.toDateString());
    if (idx > -1) list.splice(idx, 1);
    else list.push(day);
    if (type === 'urna') this.errorUrna = '';
    else this.errorDomicilio = '';
    this.cdr.detectChanges();
  }

  formatDay(d: Date): string {
    return d.toLocaleDateString('es-CO');
  }

  // ── Submit ────────────────────────────────────────────────────
  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';
    this.errorUrna = '';
    this.errorDomicilio = '';

    this.eleccionForm.markAllAsTouched();
    this.cdr.detectChanges();

    if (this.eleccionForm.invalid) return;

    if (this.votoUrna && this.selectedUrnaDays.length === 0) {
      this.errorUrna = 'Seleccione al menos un día para voto por urna.';
      this.cdr.detectChanges();
      return;
    }

    if (this.votoDomicilio && this.selectedDomicilioDays.length === 0) {
      this.errorDomicilio = 'Seleccione al menos un día para voto por domicilio.';
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    const formValue = this.eleccionForm.value;

    // Mock: simular llamada al back (cuando el backend esté listo
    // reemplazar este setTimeout por this.eleccionService.crearEleccion(payload))
    setTimeout(() => {
      queueMicrotask(() => {
        this.loading = false;
        this.showSummary = true;

        this.summary = {
          nombre: formValue.nombre,
          tipo: this.tiposEleccion[formValue.tipo] || formValue.tipo,
          caracter: formValue.listaAbierta ? 'Obligatorio' : 'Voluntario',
          fechas: `${formValue.fechaInicio} al ${formValue.fechaFinalizacion}`,
          urna: this.votoUrna ? `${this.selectedUrnaDays.length} día(s)` : 'No habilitado',
          domicilio: this.votoDomicilio
            ? `${this.selectedDomicilioDays.length} día(s)`
            : 'No habilitado',
        };

        this.successMessage = `Elección "${formValue.nombre}" creada correctamente. La jornada electoral está lista para configurar cargos y candidatos.`;
        this.cdr.detectChanges();
      });
    }, 1600);
  }
}

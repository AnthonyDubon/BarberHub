import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  AuthService
} from '../../../services/auth';

import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import {
  BarberService,
  Barber
} from '../../../services/barber';


@Component({
  selector: 'app-barbers',

  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],

  templateUrl: './barbers.html',
  styleUrl: './barbers.css'
})
export class Barbers implements OnInit {

  private barberService =
    inject(BarberService);

  private authService =
    inject(AuthService);

  private router =
    inject(Router);

  private cdr =
    inject(ChangeDetectorRef);


  barbers: Barber[] = [];

  loading = true;

  saving = false;

  errorMessage = '';

  successMessage = '';

  editingBarber: Barber | null = null;


  barberForm = new FormGroup({

    name: new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ]),

    specialty: new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ])

  });


  // =========================
  // INICIO
  // =========================

  ngOnInit() {

    this.loadBarbers();

  }


  // =========================
  // CARGAR BARBEROS
  // =========================

  loadBarbers() {

    this.loading = true;

    this.errorMessage = '';

    this.barberService
      .getBarbers()
      .subscribe({

        next: (barbers) => {

          this.barbers = barbers;

          this.loading = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Error cargando barberos:',
            error
          );

          this.errorMessage =
            'No se pudieron cargar los barberos.';

          this.loading = false;

          this.cdr.detectChanges();

        }

      });

  }


  // =========================
  // GUARDAR
  // =========================

  saveBarber() {

    this.successMessage = '';

    this.errorMessage = '';


    if (this.barberForm.invalid) {

      this.barberForm.markAllAsTouched();

      return;

    }


    const form =
      this.barberForm.getRawValue();


    const data = {

      name: form.name!,

      specialty: form.specialty!,

      active:
        this.editingBarber?.active ?? true

    };


    this.saving = true;


    // =========================
    // EDITAR
    // =========================

    if (this.editingBarber) {

      const barberId =
        this.editingBarber.id;


      this.barberService
        .updateBarber(
          barberId,
          data
        )
        .subscribe({

          next: () => {

            this.barbers =
              this.barbers.map(
                barber => {

                  if (
                    barber.id === barberId
                  ) {

                    return {
                      ...barber,
                      ...data
                    };

                  }

                  return barber;

                }
              );


            this.successMessage =
              'Barbero actualizado correctamente.';


            this.saving = false;

            this.editingBarber = null;

            this.barberForm.reset();

            this.cdr.detectChanges();

          },

          error: (error) => {

            console.error(
              'Error actualizando barbero:',
              error
            );

            this.errorMessage =
              'No se pudo actualizar el barbero.';

            this.saving = false;

            this.cdr.detectChanges();

          }

        });


      return;

    }


    // =========================
    // CREAR
    // =========================

    this.barberService
      .createBarber(data)
      .subscribe({

        next: (createdBarber) => {

          this.barbers = [
            ...this.barbers,
            createdBarber
          ];


          this.successMessage =
            'Barbero creado correctamente.';


          this.saving = false;

          this.barberForm.reset();

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Error creando barbero:',
            error
          );

          this.errorMessage =
            'No se pudo crear el barbero.';

          this.saving = false;

          this.cdr.detectChanges();

        }

      });

  }


  // =========================
  // EDITAR
  // =========================

  editBarber(
    barber: Barber
  ) {

    this.editingBarber = barber;


    this.barberForm.setValue({

      name: barber.name,

      specialty:
        barber.specialty

    });


    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }


  // =========================
  // CANCELAR EDICIÓN
  // =========================

  cancelEdit() {

    this.editingBarber = null;

    this.barberForm.reset();

  }


  // =========================
  // ACTIVAR / DESACTIVAR
  // =========================

  toggleBarber(
    barber: Barber
  ) {

    this.successMessage = '';

    this.errorMessage = '';


    // DESACTIVAR
    if (barber.active) {

      this.barberService
        .deactivateBarber(barber.id)
        .subscribe({

          next: () => {

            this.barbers =
              this.barbers.map(
                item => {

                  if (
                    item.id === barber.id
                  ) {

                    return {
                      ...item,
                      active: false
                    };

                  }

                  return item;

                }
              );


            this.successMessage =
              'Barbero desactivado.';

            this.cdr.detectChanges();

          },

          error: (error) => {

            console.error(
              'Error desactivando barbero:',
              error
            );

            this.errorMessage =
              'No se pudo desactivar el barbero.';

            this.cdr.detectChanges();

          }

        });


      return;

    }


    // =========================
    // ACTIVAR
    // =========================

    const data = {

      name: barber.name,

      specialty:
        barber.specialty,

      active: true

    };


    this.barberService
      .updateBarber(
        barber.id,
        data
      )
      .subscribe({

        next: () => {

          this.barbers =
            this.barbers.map(
              item => {

                if (
                  item.id === barber.id
                ) {

                  return {
                    ...item,
                    active: true
                  };

                }

                return item;

              }
            );


          this.successMessage =
            'Barbero activado.';

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Error activando barbero:',
            error
          );

          this.errorMessage =
            'No se pudo activar el barbero.';

          this.cdr.detectChanges();

        }

      });

  }


  // =========================
  // CERRAR SESIÓN
  // =========================

  logout() {

    this.authService.logout();

    this.router.navigate([
      '/admin/login'
    ]);

  }

}
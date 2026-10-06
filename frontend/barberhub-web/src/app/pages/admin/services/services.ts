import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { RouterLink } from '@angular/router';

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
  ServiceService,
  ShopService
} from '../../../services/service';

@Component({
  selector: 'app-services',

  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],

  templateUrl: './services.html',
  styleUrl: './services.css'
})
export class Services implements OnInit {

  private serviceService =
    inject(ServiceService);

  private cdr =
    inject(ChangeDetectorRef);


  services: ShopService[] = [];

  loading = true;

  saving = false;

  errorMessage = '';

  successMessage = '';

  editingService: ShopService | null = null;


  serviceForm = new FormGroup({

    name: new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ]),

    price: new FormControl<number | null>(
      null,
      [
        Validators.required,
        Validators.min(0)
      ]
    ),

    durationMinutes: new FormControl<number | null>(
      null,
      [
        Validators.required,
        Validators.min(1)
      ]
    )

  });


  // =========================
  // INICIO
  // =========================

  ngOnInit() {

    this.loadServices();

  }


  // =========================
  // CARGAR SERVICIOS
  // =========================

  loadServices() {

    this.loading = true;

    this.errorMessage = '';

    this.serviceService
      .getServices()
      .subscribe({

        next: (services) => {

          this.services = services;

          this.loading = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Error cargando servicios:',
            error
          );

          this.errorMessage =
            'No se pudieron cargar los servicios.';

          this.loading = false;

          this.cdr.detectChanges();

        }

      });

  }


  // =========================
  // GUARDAR
  // =========================

  saveService() {

    this.successMessage = '';

    this.errorMessage = '';

    if (this.serviceForm.invalid) {

      this.serviceForm.markAllAsTouched();

      return;

    }


    const form =
      this.serviceForm.getRawValue();


    const data = {

      name: form.name!,

      price: Number(form.price),

      durationMinutes:
        Number(form.durationMinutes),

      active:
        this.editingService?.active ?? true

    };


    this.saving = true;


    // =========================
    // EDITAR
    // =========================

    if (this.editingService) {

      const serviceId =
        this.editingService.id;


      this.serviceService
        .updateService(
          serviceId,
          data
        )
        .subscribe({

          next: () => {

            this.services =
              this.services.map(
                service => {

                  if (
                    service.id === serviceId
                  ) {

                    return {
                      ...service,
                      ...data
                    };

                  }

                  return service;

                }
              );


            this.successMessage =
              'Servicio actualizado correctamente.';


            this.saving = false;

            this.editingService = null;

            this.serviceForm.reset();

            this.cdr.detectChanges();

          },

          error: (error) => {

            console.error(
              'Error actualizando servicio:',
              error
            );

            this.errorMessage =
              'No se pudo actualizar el servicio.';

            this.saving = false;

            this.cdr.detectChanges();

          }

        });


      return;

    }


    // =========================
    // CREAR
    // =========================

    this.serviceService
      .createService(data)
      .subscribe({

        next: (createdService) => {

          this.services = [
            ...this.services,
            createdService
          ];


          this.successMessage =
            'Servicio creado correctamente.';


          this.saving = false;

          this.serviceForm.reset();

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Error creando servicio:',
            error
          );

          this.errorMessage =
            'No se pudo crear el servicio.';

          this.saving = false;

          this.cdr.detectChanges();

        }

      });

  }


  // =========================
  // EDITAR
  // =========================

  editService(
    service: ShopService
  ) {

    this.editingService = service;


    this.serviceForm.setValue({

      name: service.name,

      price: service.price,

      durationMinutes:
        service.durationMinutes

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

    this.editingService = null;

    this.serviceForm.reset();

  }


  // =========================
  // ACTIVAR / DESACTIVAR
  // =========================

  toggleService(
    service: ShopService
  ) {

    this.errorMessage = '';

    this.successMessage = '';


    // DESACTIVAR
    if (service.active) {

      this.serviceService
        .deactivateService(service.id)
        .subscribe({

          next: () => {

            this.services =
              this.services.map(
                item => {

                  if (
                    item.id === service.id
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
              'Servicio desactivado.';

            this.cdr.detectChanges();

          },

          error: (error) => {

            console.error(
              'Error desactivando servicio:',
              error
            );

            this.errorMessage =
              'No se pudo desactivar el servicio.';

            this.cdr.detectChanges();

          }

        });


      return;

    }


    // ACTIVAR

    const data = {

      name: service.name,

      price: service.price,

      durationMinutes:
        service.durationMinutes,

      active: true

    };


    this.serviceService
      .updateService(
        service.id,
        data
      )
      .subscribe({

        next: () => {

          this.services =
            this.services.map(
              item => {

                if (
                  item.id === service.id
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
            'Servicio activado.';

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Error activando servicio:',
            error
          );

          this.errorMessage =
            'No se pudo activar el servicio.';

          this.cdr.detectChanges();

        }

      });

  }

}
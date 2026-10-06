import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import {
  AdminAppointmentsService,
  Appointment
} from '../../../services/admin-appointments';

import {
  ServiceService,
  ShopService
} from '../../../services/service';

import {
  BarberService,
  Barber
} from '../../../services/barber';

@Component({
  selector: 'app-appointments',
  imports: [
    RouterLink,
    DatePipe,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css'
})
export class Appointments implements OnInit {

  private appointmentsService =
    inject(AdminAppointmentsService);

  private serviceService =
    inject(ServiceService);

  private barberService =
    inject(BarberService);

  private cdr =
    inject(ChangeDetectorRef);


  appointments: Appointment[] = [];

  services: ShopService[] = [];

  barbers: Barber[] = [];


  loading = true;

  errorMessage = '';

  actionAppointmentId = '';


  ngOnInit() {

    this.loadServices();

    this.loadBarbers();

    this.loadAppointments();

  }


  // =========================
  // CITAS
  // =========================

  loadAppointments() {

    this.loading = true;

    this.errorMessage = '';

    this.appointmentsService
      .getAppointments()
      .subscribe({

        next: (appointments) => {

          this.appointments = appointments;

          this.loading = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Error cargando citas:',
            error
          );

          this.errorMessage =
            'No se pudieron cargar las citas.';

          this.loading = false;

          this.cdr.detectChanges();

        }

      });

  }


  // =========================
  // SERVICIOS
  // =========================

  loadServices() {

    this.serviceService
      .getServices()
      .subscribe({

        next: (services) => {

          this.services = services;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Error cargando servicios:',
            error
          );

        }

      });

  }


  // =========================
  // BARBEROS
  // =========================

  loadBarbers() {

    this.barberService
      .getBarbers()
      .subscribe({

        next: (barbers) => {

          this.barbers = barbers;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Error cargando barberos:',
            error
          );

        }

      });

  }


  // =========================
  // NOMBRE SERVICIO
  // =========================

  getServiceName(serviceId: string): string {

    return this.services.find(
      service =>
        service.id === serviceId
    )?.name ?? 'Servicio no disponible';

  }


  // =========================
  // NOMBRE BARBERO
  // =========================

  getBarberName(barberId: string): string {

    return this.barbers.find(
      barber =>
        barber.id === barberId
    )?.name ?? 'Barbero no disponible';

  }


  // =========================
  // CONFIRMAR
  // =========================

  confirmAppointment(id: string) {

    if (this.actionAppointmentId) {
      return;
    }

    this.errorMessage = '';

    this.actionAppointmentId = id;


    this.appointmentsService
      .confirmAppointment(id)
      .subscribe({

        next: () => {

          this.appointments =
            this.appointments.map(
              appointment => {

                if (appointment.id === id) {

                  return {
                    ...appointment,
                    status: 'Confirmed'
                  };

                }

                return appointment;

              }
            );

          this.actionAppointmentId = '';

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Error confirmando cita:',
            error
          );

          this.errorMessage =
            'No se pudo confirmar la cita.';

          this.actionAppointmentId = '';

          this.cdr.detectChanges();

        }

      });

  }


  // =========================
  // RECHAZAR
  // =========================

  rejectAppointment(id: string) {

    if (this.actionAppointmentId) {
      return;
    }

    this.errorMessage = '';

    this.actionAppointmentId = id;


    this.appointmentsService
      .rejectAppointment(id)
      .subscribe({

        next: () => {

          this.appointments =
            this.appointments.map(
              appointment => {

                if (appointment.id === id) {

                  return {
                    ...appointment,
                    status: 'Rejected'
                  };

                }

                return appointment;

              }
            );

          this.actionAppointmentId = '';

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Error rechazando cita:',
            error
          );

          this.errorMessage =
            'No se pudo rechazar la cita.';

          this.actionAppointmentId = '';

          this.cdr.detectChanges();

        }

      });

  }

}
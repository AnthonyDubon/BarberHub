import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

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
  selector: 'app-dashboard',

  imports: [
    RouterLink,
    MatIconModule
  ],

  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  private appointmentsService =
    inject(AdminAppointmentsService);

  private serviceService =
    inject(ServiceService);

  private barberService =
    inject(BarberService);

  private cdr =
    inject(ChangeDetectorRef);


  // =========================
  // DATOS
  // =========================

  appointments: Appointment[] = [];

  services: ShopService[] = [];

  barbers: Barber[] = [];


  // =========================
  // ESTADOS
  // =========================

  loading = true;


  // =========================
  // ESTADÍSTICAS
  // =========================

  totalAppointments = 0;

  pendingAppointments = 0;

  confirmedAppointments = 0;

  rejectedAppointments = 0;


  // =========================
  // INICIO
  // =========================

  ngOnInit() {

    this.loadServices();

    this.loadBarbers();

    this.loadAppointments();

  }


  // =========================
  // CARGAR CITAS
  // =========================

  loadAppointments() {

    this.loading = true;

    this.appointmentsService
      .getAppointments()
      .subscribe({

        next: (appointments) => {

          this.appointments = appointments;


          // TOTAL
          this.totalAppointments =
            appointments.length;


          // PENDIENTES
          this.pendingAppointments =
            appointments.filter(
              appointment =>
                appointment.status
                  ?.toLowerCase() === 'pending'
            ).length;


          // CONFIRMADAS
          this.confirmedAppointments =
            appointments.filter(
              appointment =>
                appointment.status
                  ?.toLowerCase() === 'confirmed'
            ).length;


          // RECHAZADAS
          this.rejectedAppointments =
            appointments.filter(
              appointment =>
                appointment.status
                  ?.toLowerCase() === 'rejected'
            ).length;


          this.loading = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Error cargando citas:',
            error
          );

          this.loading = false;

          this.cdr.detectChanges();

        }

      });

  }


  // =========================
  // CARGAR SERVICIOS
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
  // CARGAR BARBEROS
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
  // NOMBRE DEL SERVICIO
  // =========================

  getServiceName(serviceId: string): string {

    const service =
      this.services.find(
        service =>
          service.id === serviceId
      );

    return service?.name ??
      'Servicio no disponible';

  }


  // =========================
  // NOMBRE DEL BARBERO
  // =========================

  getBarberName(barberId: string): string {

    const barber =
      this.barbers.find(
        barber =>
          barber.id === barberId
      );

    return barber?.name ??
      'Barbero no disponible';

  }

}
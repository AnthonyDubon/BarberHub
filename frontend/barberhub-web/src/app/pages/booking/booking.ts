import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import { BookingService } from '../../services/booking';

import {
  ServiceService,
  ShopService
} from '../../services/service';

import {
  BarberService,
  Barber
} from '../../services/barber';


@Component({
  selector: 'app-booking',

  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule
  ],

  templateUrl: './booking.html',
  styleUrl: './booking.css'
})
export class Booking implements OnInit {

  private bookingService = inject(BookingService);

  private serviceService = inject(ServiceService);

  private barberService = inject(BarberService);


  // DATOS REALES DEL BACKEND
  services: ShopService[] = [];

  barbers: Barber[] = [];


  // ESTADOS
  isSubmitting = false;

  loadingData = true;

  successMessage = '';

  errorMessage = '';


  // CONTROL DE CARGA
  private servicesLoaded = false;

  private barbersLoaded = false;


  // HORARIOS DISPONIBLES
  availableTimes: string[] = [];


  // FECHA MÍNIMA
  today = new Date().toISOString().split('T')[0];


  // FORMULARIO
  bookingForm = new FormGroup({

    name: new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ]),

    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]{8}$/)
    ]),

    service: new FormControl('', Validators.required),

    barber: new FormControl('', Validators.required),

    date: new FormControl('', Validators.required),

    time: new FormControl('', Validators.required)

  });


  // INICIO
  ngOnInit() {

    this.loadServices();

    this.loadBarbers();

  }


  // ============================
  // CARGAR SERVICIOS
  // ============================

  loadServices() {

    this.serviceService
      .getServices()
      .subscribe({

        next: (services) => {

          console.log(
            'SERVICIOS RECIBIDOS:',
            services
          );

          this.services = services.filter(
            service => service.active === true
          );

          console.log(
            'SERVICIOS ACTIVOS:',
            this.services
          );

          this.servicesLoaded = true;

          this.checkLoading();

        },

        error: (error) => {

          console.error(
            'ERROR CARGANDO SERVICIOS:',
            error
          );

          this.errorMessage =
            'No se pudieron cargar los servicios.';

          this.servicesLoaded = true;

          this.checkLoading();

        }

      });

  }


  // ============================
  // CARGAR BARBEROS
  // ============================

  loadBarbers() {

    this.barberService
      .getBarbers()
      .subscribe({

        next: (barbers) => {

          console.log(
            'BARBEROS RECIBIDOS:',
            barbers
          );

          this.barbers = barbers.filter(
            barber => barber.active === true
          );

          console.log(
            'BARBEROS ACTIVOS:',
            this.barbers
          );

          this.barbersLoaded = true;

          this.checkLoading();

        },

        error: (error) => {

          console.error(
            'ERROR CARGANDO BARBEROS:',
            error
          );

          this.errorMessage =
            'No se pudieron cargar los barberos.';

          this.barbersLoaded = true;

          this.checkLoading();

        }

      });

  }


  // ============================
  // VERIFICAR CARGA
  // ============================

  private checkLoading() {

    if (
      this.servicesLoaded &&
      this.barbersLoaded
    ) {

      this.loadingData = false;

    }

  }


  // ============================
  // ACTUALIZAR HORARIOS
  // ============================

  updateAvailableTimes() {

    const barberId =
      this.bookingForm.controls.barber.value;

    const date =
      this.bookingForm.controls.date.value;


    this.bookingForm.controls.time.setValue('');

    this.successMessage = '';

    this.errorMessage = '';


    if (!barberId || !date) {

      this.availableTimes = [];

      return;

    }


    // TEMPORAL
    // Después estos horarios vendrán del backend.

    this.availableTimes = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00'
    ];

  }


  // ============================
  // CREAR CITA
  // ============================

  onSubmit() {

    this.successMessage = '';

    this.errorMessage = '';


    if (this.bookingForm.invalid) {

      this.bookingForm.markAllAsTouched();

      return;

    }


    const formValue =
      this.bookingForm.getRawValue();


    // FECHA LOCAL DEL CLIENTE
    const localDate = new Date(
      `${formValue.date}T${formValue.time}:00`
    );


    // OBJETO PARA EL BACKEND
    const appointment = {

      clientName:
        formValue.name,

      clientPhone:
        formValue.phone,

      // ID REAL DEL SERVICIO EN FIRESTORE
      serviceId:
        formValue.service,

      // ID REAL DEL BARBERO EN FIRESTORE
      barberId:
        formValue.barber,

      appointmentDate:
        localDate.toISOString()

    };


    console.log(
      'ENVIANDO CITA:',
      appointment
    );


    this.isSubmitting = true;


    this.bookingService
      .createAppointment(appointment)
      .subscribe({

        next: (response) => {

          console.log(
            'CITA CREADA:',
            response
          );


          this.successMessage =
            '¡Cita solicitada correctamente! Tu cita quedó pendiente de confirmación.';


          this.isSubmitting = false;


          // LIMPIAR FORMULARIO
          this.bookingForm.reset();


          // LIMPIAR HORARIOS
          this.availableTimes = [];

        },


        error: (error) => {

          console.error(
            'ERROR CREANDO CITA:',
            error
          );


          this.errorMessage =
            'No pudimos crear la cita. Intenta nuevamente.';


          this.isSubmitting = false;

        }

      });

  }

}
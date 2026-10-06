import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:5139/api/Appointments';

  createAppointment(appointment: unknown) {
    return this.http.post(this.apiUrl, appointment);
  }

}
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/Appointments`;

  createAppointment(appointment: unknown) {
    return this.http.post(this.apiUrl, appointment);
  }

}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  barberId: string;
  appointmentDate: string;
  status: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminAppointmentsService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:5139/api/Appointments';

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl);
  }

  confirmAppointment(id: string): Observable<unknown> {
    return this.http.patch(
      `${this.apiUrl}/${id}/confirm`,
      {}
    );
  }

  rejectAppointment(id: string): Observable<unknown> {
    return this.http.patch(
      `${this.apiUrl}/${id}/reject`,
      {}
    );
  }
}
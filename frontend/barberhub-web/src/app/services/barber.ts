import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Barber {
  id: string;
  name: string;
  specialty: string;
  active: boolean;
  createdAt?: string;
}

export interface BarberRequest {
  name: string;
  specialty: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BarberService {

  private http = inject(HttpClient);

  private apiUrl =
    'http://localhost:5139/api/Barbers';

  getBarbers(): Observable<Barber[]> {
    return this.http.get<Barber[]>(this.apiUrl);
  }

  getBarber(id: string): Observable<Barber> {
    return this.http.get<Barber>(
      `${this.apiUrl}/${id}`
    );
  }

  createBarber(
    barber: BarberRequest
  ): Observable<Barber> {

    return this.http.post<Barber>(
      this.apiUrl,
      barber
    );
  }

  updateBarber(
    id: string,
    barber: BarberRequest
  ): Observable<unknown> {

    return this.http.put(
      `${this.apiUrl}/${id}`,
      barber
    );
  }

  deactivateBarber(id: string): Observable<unknown> {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }
}
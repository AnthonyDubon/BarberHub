import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ShopService {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  active: boolean;
  createdAt?: string;
}

export interface ServiceRequest {
  name: string;
  price: number;
  durationMinutes: number;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private http = inject(HttpClient);

  private apiUrl =
    `${environment.apiUrl}/Services`;

  getServices(): Observable<ShopService[]> {
    return this.http.get<ShopService[]>(this.apiUrl);
  }

  getService(id: string): Observable<ShopService> {
    return this.http.get<ShopService>(
      `${this.apiUrl}/${id}`
    );
  }

  createService(
    service: ServiceRequest
  ): Observable<ShopService> {

    return this.http.post<ShopService>(
      this.apiUrl,
      service
    );
  }

  updateService(
    id: string,
    service: ServiceRequest
  ): Observable<unknown> {

    return this.http.put(
      `${this.apiUrl}/${id}`,
      service
    );
  }

  deactivateService(id: string): Observable<unknown> {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }
}


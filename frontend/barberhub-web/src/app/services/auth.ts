import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  name: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  private apiUrl =
    'http://localhost:5139/api/Auth';

  private readonly TOKEN_KEY =
    'barberhub_token';

  private readonly NAME_KEY =
    'barberhub_admin_name';

  private readonly ROLE_KEY =
    'barberhub_admin_role';


  login(
    credentials: LoginRequest
  ): Observable<LoginResponse> {

    return this.http
      .post<LoginResponse>(
        `${this.apiUrl}/login`,
        credentials
      )
      .pipe(

        tap(response => {

          localStorage.setItem(
            this.TOKEN_KEY,
            response.token
          );

          localStorage.setItem(
            this.NAME_KEY,
            response.name
          );

          localStorage.setItem(
            this.ROLE_KEY,
            response.role
          );

        })

      );

  }


  logout(): void {

    localStorage.removeItem(
      this.TOKEN_KEY
    );

    localStorage.removeItem(
      this.NAME_KEY
    );

    localStorage.removeItem(
      this.ROLE_KEY
    );

  }


  getToken(): string | null {

    return localStorage.getItem(
      this.TOKEN_KEY
    );

  }


  getName(): string {

    return localStorage.getItem(
      this.NAME_KEY
    ) ?? 'Administrador';

  }


  getRole(): string | null {

    return localStorage.getItem(
      this.ROLE_KEY
    );

  }


  isAuthenticated(): boolean {

    const token = this.getToken();

    if (!token) {
      return false;
    }

    return !this.isTokenExpired(token);

  }


  private isTokenExpired(
    token: string
  ): boolean {

    try {

      const payload =
        JSON.parse(
          atob(
            token.split('.')[1]
              .replace(/-/g, '+')
              .replace(/_/g, '/')
          )
        );

      if (!payload.exp) {
        return false;
      }

      const expiration =
        payload.exp * 1000;

      return Date.now() >= expiration;

    } catch {

      return true;

    }

  }

}
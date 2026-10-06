import { inject } from '@angular/core';

import {
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';

import {
  Router
} from '@angular/router';

import {
  catchError,
  throwError
} from 'rxjs';

import {
  AuthService
} from '../services/auth';


export const authInterceptor:
  HttpInterceptorFn = (
    req,
    next
  ) => {

    const authService =
      inject(AuthService);

    const router =
      inject(Router);


    const token =
      authService.getToken();


    const backendUrl =
      'http://localhost:5139/api/';


    const isBackendRequest =
      req.url.startsWith(
        backendUrl
      );


    let request = req;


    // Si tenemos token y la petición
    // pertenece a nuestro backend,
    // enviamos Authorization.
    //
    // Las rutas públicas NO requieren
    // token, así que siguen funcionando
    // aunque el cliente no tenga sesión.

    if (
      token &&
      isBackendRequest
    ) {

      request =
        req.clone({

          setHeaders: {

            Authorization:
              `Bearer ${token}`

          }

        });

    }


    return next(request)
      .pipe(

        catchError(
          (
            error:
              HttpErrorResponse
          ) => {

            /*
             * Solo cerramos la sesión
             * por 401 si había token.
             *
             * Así un posible 401 del
             * login no provoca comportamientos
             * extraños.
             */

            if (
              error.status === 401 &&
              token
            ) {

              authService.logout();

              router.navigate([
                '/admin/login'
              ]);

            }


            return throwError(
              () => error
            );

          }
        )

      );

  };
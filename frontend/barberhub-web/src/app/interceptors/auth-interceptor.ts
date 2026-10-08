import { environment } from '../../environments/environment';
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
      `${environment.apiUrl}/`;


    const isBackendRequest =
      req.url.startsWith(
        backendUrl
      );


    let request = req;


    // Si tenemos token y la peticiÃ³n
    // pertenece a nuestro backend,
    // enviamos Authorization.
    //
    // Las rutas pÃºblicas NO requieren
    // token, asÃ­ que siguen funcionando
    // aunque el cliente no tenga sesiÃ³n.

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
             * Solo cerramos la sesiÃ³n
             * por 401 si habÃ­a token.
             *
             * AsÃ­ un posible 401 del
             * login no provoca comportamientos
             * extraÃ±os.
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

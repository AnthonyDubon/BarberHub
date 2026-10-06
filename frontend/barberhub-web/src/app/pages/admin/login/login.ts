import {
  Component,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  MatFormFieldModule
} from '@angular/material/form-field';

import {
  MatInputModule
} from '@angular/material/input';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatIconModule
} from '@angular/material/icon';

import {
  AuthService
} from '../../../services/auth';


@Component({
  selector: 'app-login',

  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],

  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private authService =
    inject(AuthService);

  private router =
    inject(Router);

  private cdr =
    inject(ChangeDetectorRef);


  loading = false;

  errorMessage = '';

  hidePassword = true;


  loginForm = new FormGroup({

    email: new FormControl(
      '',
      [
        Validators.required,
        Validators.email
      ]
    ),

    password: new FormControl(
      '',
      [
        Validators.required
      ]
    )

  });


  login() {

    this.errorMessage = '';


    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;

    }


    const credentials = {

      email:
        this.loginForm.value.email!,

      password:
        this.loginForm.value.password!

    };


    this.loading = true;


    this.authService
      .login(credentials)
      .subscribe({

        next: () => {

          this.loading = false;

          this.router.navigate([
            '/admin'
          ]);

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Error login:',
            error
          );


          if (
            error.status === 401
          ) {

            this.errorMessage =
              'Correo o contraseña incorrectos.';

          } else {

            this.errorMessage =
              'No se pudo iniciar sesión. Intenta nuevamente.';

          }


          this.loading = false;

          this.cdr.detectChanges();

        }

      });

  }

}
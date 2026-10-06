import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Booking } from './pages/booking/booking';

import { Dashboard } from './pages/admin/dashboard/dashboard';
import { Appointments } from './pages/admin/appointments/appointments';
import { Login } from './pages/admin/login/login';
import { Services } from './pages/admin/services/services';
import { Barbers } from './pages/admin/barbers/barbers';

import {
  authGuard
} from './guards/auth-guard';


export const routes: Routes = [

  // =========================
  // PÚBLICO
  // =========================

  {
    path: '',
    component: Home
  },

  {
    path: 'reservar',
    component: Booking
  },


  // =========================
  // LOGIN
  // =========================

  {
    path: 'admin/login',
    component: Login
  },


  // =========================
  // ADMIN PROTEGIDO
  // =========================

  {
    path: 'admin',
    component: Dashboard,
    canActivate: [authGuard]
  },

  {
    path: 'admin/citas',
    component: Appointments,
    canActivate: [authGuard]
  },

  {
    path: 'admin/servicios',
    component: Services,
    canActivate: [authGuard]
  },

  {
    path: 'admin/barberos',
    component: Barbers,
    canActivate: [authGuard]
  },


  // =========================
  // 404
  // =========================

  {
    path: '**',
    redirectTo: ''
  }

];
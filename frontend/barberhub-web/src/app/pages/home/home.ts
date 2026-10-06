import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [MatCardModule, MatIconModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

services = [
  {
    name: 'Corte de cabello',
    description: 'Corte personalizado según tu estilo.',
    price: 150,
    icon: 'content_cut'
  },
  {
    name: 'Barba',
    description: 'Perfilado y arreglo profesional de barba.',
    price: 100,
    icon: 'face'
  },
  {
    name: 'Corte + barba',
    description: 'Servicio completo de corte y arreglo de barba.',
    price: 220,
    icon: 'auto_awesome'
  }
];

barbers = [
  {
    name: 'Carlos',
    specialty: 'Especialista en cortes modernos y degradados.'
  },
  {
    name: 'Miguel',
    specialty: 'Especialista en cortes clásicos y arreglo de barba.'
  },
  {
    name: 'Daniel',
    specialty: 'Especialista en fades, diseños y estilos modernos.'
  }
];

}
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  getAreas() {
    return ['Diseño', 'Estrategia', 'Marketing', 'Operaciones'];
  }

  getCuriosities() {
    return [
      {
        order: 0,
        title: 'Me levanto a las'
      },
      {
        order: 1,
        title: 'Mi rutina:'
      },
      {
        order: 2,
        title: 'Mi desayuno:'
      },
      {
        order: 3,
        title: 'Aficiones:'
      },
      {
        order: 4,
        title: 'Manias:'
      },
      {
        order: 5,
        title: 'Deseo:'
      },
    ];
  }

  getSocialLinks() {
    return [
      {
        name: 'instagram',
        icon: 'logo-instagram'
      },
      {
        name: 'linkedin',
        icon: 'logo-linkedin'
      },
    ];
  }

  getTrainingAreas() {
    return ['Comunicación', 'Marketing', 'Webinar'];
  }

  getTrainingTypes() {
    return ['Video', 'PDF'];
  }

}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  getAreas() {
    return ['Diseño gráfico', 'Diseño de producto', 'Arquitectura', 'Diseño web', 'Abogado', 'Programación', 'SEM', 'SEO', 'Traducción', 'RRSS', 'Copywritting', 'Gestión de eventos', 'Facebook Ads', 'Google Ads', 'Marketing digital', 'Contabilidad', 'Productividad', 'Gestión del tiempo', 'Funnels', 'Fotografía', 'Vídeo', 'Edición de fotografía', 'Edición de vídeo'];
  }

  getCuriosities() {
    return [
      {
        order: 0,
        title: '¿A que hora te levantas?'
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

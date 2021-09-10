import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  getAreas() {
    return['Abogado', 'Arquitectura', 'Branding', 'Community builder', 'Coaching', 'Comunicación', 'Contabilidad', 'Copywritting', 'Creación de marcas', 'Diseño de producto', 'Diseño editorial', 'Diseño gráfico', 'Diseño web', 'Edición de fotografía', 'Edición de vídeo', 'Escritor', 'Estrategia empresarial', 'Facebook Ads', 'Finanzas', 'Fotografía', 'Funnels', 'Gestión de eventos', 'Gestión de procesos', 'Gestión de proyectos', 'Gestión del tiempo', 'Google Ads', 'Ilustración', 'Interiorismo', 'Lettering', 'Marketing digital', 'Organización y productividad', 'Product Manager', 'Productividad', 'Programación', 'Programación web', 'Psicología', 'RRSS', 'SEM', 'SEO', 'Traducción', 'Vídeo'];
    // return ['Diseño gráfico', 'Diseño de producto', 'Arquitectura', 'Diseño web', 'Abogado', 'Programación', 'SEM', 'SEO', 'Traducción', 'RRSS', 'Copywritting', 'Gestión de eventos', 'Facebook Ads', 'Google Ads', 'Marketing digital', 'Contabilidad', 'Productividad', 'Gestión del tiempo', 'Funnels', 'Fotografía', 'Vídeo', 'Edición de fotografía', 'Edición de vídeo', 'Gestión de proyectos', 'Creación de marcas', 'Community builder', 'Finanzas', 'Estrategia empresarial', 'Coaching', 'Product Manager', 'Interiorismo', 'Ilustración', 'Lettering', 'Diseño editorial', 'Escritor', 'Comunicación', 'Branding', 'Psicología', 'Organización y productividad', 'Gestión de procesos', 'Programación web'];
  }

  getCuriosities() {
    return [
      {
        order: 0,
        title: '¿Cuál es tu libro favorito?'
      },
      {
        order: 1,
        title: '¿Qué te gusta hacer en tu tiempo libre?'
      },
      {
        order: 2,
        title: 'Algo que te encanta:'
      },
      {
        order: 3,
        title: 'Algo que no soportes:'
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

  getPartnershipsTypes() {
    return ['Comida y take away', 'Formación', 'Tecnología', 'Servicios', 'Otros']
    // return ['Compras', 'Deporte y aire libre', 'Gastronomía', 'Movilidad', 'Ocio y cultura', 'Salud y bienestar', 'Viajes']
  }

  getDiscordLink() {
    return "https://discord.com/channels/801826547107102781/801852052543504484";
  }

  getInstagramLink() {
    return "https://www.instagram.com/on.sowo/";
  }

  getMastermindLink() {
    return "https://www.sowo.es/alta-mastermind/"
  }

}

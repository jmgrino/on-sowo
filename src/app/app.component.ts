import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AuthService } from './auth/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    {
      title: 'Perfil',
      subtitle: '',
      url: '/profile',
      icon: 'people',
      onlyAuth: true,
      onlyAdmin: false,
      hideOnAuth: false
    },
    {
      title: 'OnSowers',
      subtitle: '',
      url: '/folder/onsowers',
      icon: 'help',
      onlyAuth: true,
      onlyAdmin: false,
      hideOnAuth: false
    },
    {
      title: 'Mastermind',
      subtitle: '',
      url: '/folder/mastermind',
      icon: 'help',
      onlyAuth: true,
      onlyAdmin: false,
      hideOnAuth: false
    },
    {
      title: 'Formacion y recursos',
      subtitle: '',
      url: '/folder/training',
      icon: 'help',
      onlyAuth: true,
      onlyAdmin: false,
      hideOnAuth: false
    },
    {
      title: 'Eventos',
      subtitle: '',
      url: '/folder/events',
      icon: 'help',
      onlyAuth: true,
      onlyAdmin: false,
      hideOnAuth: false
    },
    {
      title: 'Asesoramientos',
      subtitle: '',
      url: '/folder/advices',
      icon: 'help',
      onlyAuth: true,
      onlyAdmin: false,
      hideOnAuth: false
    },
    {
      title: 'Partnerships',
      subtitle: 'Próximamente',
      url: '/folder/partnerships',
      icon: 'help',
      onlyAuth: true,
      onlyAdmin: false,
      hideOnAuth: false
    },
  ];

  public bottomPages = [
    {
      title: 'Logout',
      subtitle: '',
      url: '/auth/login',
      icon: 'people',
      onlyAuth: true,
      onlyAdmin: false,
      hideOnAuth: true
    },
  ]

  public selectedIndex = 0;
  public appFilteredPages = [];
  // isLoggedIn = false;

  constructor(
    private platform: Platform,
    // private splashScreen: SplashScreen,
    // private statusBar: StatusBar,
    private authService: AuthService,
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.authService.initAuthListener();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.authService.getCurrentUser().subscribe(  user => {
        if (user) {
          // this.isLoggedIn = true;
          if (user.isAdmin === true) {
            this.appFilteredPages = this.appPages.filter( menuItem => menuItem.hideOnAuth === false);
          } else {
            this.appFilteredPages = this.appPages.filter( menuItem => ( menuItem.hideOnAuth === false && menuItem.onlyAdmin === false ));
          }
        } else {
          // this.isLoggedIn = false;
          this.appFilteredPages = this.appPages.filter( menuItem => menuItem.onlyAuth === false);
        }
      });
      // this.statusBar.styleDefault();
      // this.splashScreen.hide();
    });

  }


}

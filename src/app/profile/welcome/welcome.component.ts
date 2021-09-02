import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  user;

  constructor(
    private auth: AuthService,
    private sidemenu: MenuController,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user = this.router.getCurrentNavigation().extras.state;

  }

  ionViewWillEnter() {
    this.sidemenu.enable(false);
  }

  // onLater() {
  //   // this.auth.logout();
  //   // this.router.navigateByUrl('/auth/login');
  //   this.router.navigateByUrl('/profile');
  // }

  // onNow() {
  //   this.router.navigateByUrl('/onsowers/init');
  // }

  onFinish() {
    this.router.navigateByUrl('/auth/login');
  }

}
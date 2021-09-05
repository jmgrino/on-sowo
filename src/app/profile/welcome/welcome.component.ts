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
    console.log(this.router.getCurrentNavigation().extras.state);
    if (this.router.getCurrentNavigation().extras.state) {
      this.user = this.router.getCurrentNavigation().extras.state;
      this.auth.sendEmailVerification(this.user.email, this.user.password);
    } else {
      this.router.navigateByUrl('/auth/login');
    }

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

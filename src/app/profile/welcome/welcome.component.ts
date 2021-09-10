import { UIService } from 'src/app/shared/ui.service';
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
  sendTime: number;

  constructor(
    private auth: AuthService,
    private sidemenu: MenuController,
    private router: Router,
    private uiService: UIService,
  ) { }

  ngOnInit() {
    if (this.router.getCurrentNavigation().extras.state) {
      this.user = this.router.getCurrentNavigation().extras.state;
      this.auth.sendEmailVerification(this.user.email, this.user.password);
      const now = new Date();
      this.sendTime = now.getTime();
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

  OnNewMail() {
    const now = new Date();
    const elapsedTime = now.getTime() - this.sendTime;

    if ( elapsedTime > 60000 ) {
      this.auth.sendEmailVerification(this.user.email, this.user.password)
      const message = "Te hemos enviado otro email de verificación";
      this.uiService.showStdSnackbar(message);
      this.sendTime = now.getTime();
    } else {
      const message = "Espera al menos un minuto para pedir el reenvio del email de verificación (han pasado solo " + Math.trunc(elapsedTime / 1000) + ' segundos)';
      this.uiService.showStdSnackbar(message);
    }

  }

}

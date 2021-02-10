import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: User;

  constructor(
    private sidemenu: MenuController,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe( user => {
      if (user) {
        this.user = user;
        if (this.user.email == 'jmgrino@gmail.com') {
          this.user.displayName = 'Josep Maria';
        } else {
          this.user.displayName = 'Laura';
        }
      }
    })
  }

  ionViewWillEnter() {
    this.sidemenu.enable(true);
  }

}

import { DataService } from 'src/app/shared/data.service';
import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';

@Component({
  selector: 'app-mastermind',
  templateUrl: './mastermind.page.html',
  styleUrls: ['./mastermind.page.scss'],
})
export class MastermindPage implements OnInit {
  user: User;

  constructor(
    private auth: AuthService,
    private sidemenu: MenuController,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.auth.getCurrentUser().subscribe( user => {
      if (user) {
        this.user = user;
      }

    });

  }

  ionViewWillEnter() {
    this.sidemenu.enable(true);
  }

  onParticipate() {
    alert('Opción no implementada');

  }

  OnDiscord() {
    const discordLink = this.dataService.getDiscordLink();
    window.open(discordLink, "_blank");
  }

}

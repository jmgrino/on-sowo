import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { DataService } from '../shared/data.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
})
export class CommunityPage implements OnInit {
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
    const discordLink = this.dataService.getDiscordLink();
    window.open(discordLink, "_blank");
  }

  OnDiscord() {
    const discordLink = this.dataService.getDiscordLink();
    window.open(discordLink, "_blank");
  }


  onInstagram() {
    const discordLink = this.dataService.getInstagramLink();
    window.open(discordLink, "_blank");
  }

}

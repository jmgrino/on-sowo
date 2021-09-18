import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { DataService } from '../shared/data.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  id: string;
  folder: string;
  user: User;

  constructor(
    private auth: AuthService,
    private sidemenu: MenuController,
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    ) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    switch(this.id) {
      case 'advices':
        this.folder = 'Asesoramiento'
        break;

      default:
        this.folder = this.id
    }

    this.auth.getCurrentUser().subscribe( user => {
      if (user) {
        this.user = user;
      }

    });
  }

  ionViewWillEnter() {
    this.sidemenu.enable(true);
  }


  OnDiscord() {
    const discordLink = this.dataService.getDiscordLink();
    window.open(discordLink, "_blank");
  }

}

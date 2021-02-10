import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-blank',
  templateUrl: './blank.component.html',
  styleUrls: ['./blank.component.scss'],
})
export class BlankComponent implements OnInit {

  constructor(
    private sidemenu: MenuController,
    private router: Router
  ) { }

  ngOnInit() {
    this.sidemenu.enable(false);
    this.router.navigateByUrl('/profile');
  }

  ionViewDidEnter() {

    this.sidemenu.enable(false);

  }

}

import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(
    private sidemenu: MenuController,
  ) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.sidemenu.enable(false);

  }

}

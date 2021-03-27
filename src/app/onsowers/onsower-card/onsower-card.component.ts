import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/auth/user.model';

@Component({
  selector: 'app-onsower-card',
  templateUrl: './onsower-card.component.html',
  styleUrls: ['./onsower-card.component.scss'],
})
export class OnsowerCardComponent implements OnInit {
  @Input() onSower: User;
  defaultValue = '../../assets/img/unknown_person.png';
  onSowerPrintName: string;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    const printName = (this.onSower.displayName ? this.onSower.displayName.toLocaleUpperCase() : '')
      + ' ' + (this.onSower.familyName ? this.onSower.familyName.toLocaleUpperCase() : '');

    if (printName.trim().length == 0) {
      this.onSowerPrintName = this.onSower.email;
    } else {
      this.onSowerPrintName = printName;
    }
  }

}

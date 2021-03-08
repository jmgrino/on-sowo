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

  constructor(
    private router: Router
  ) { }

  ngOnInit() {}

}

import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/auth/user.model';

@Component({
  selector: 'app-onsower',
  templateUrl: './onsower.component.html',
  styleUrls: ['./onsower.component.scss'],
})
export class OnsowerComponent implements OnInit {
  @Input() onSower: User;
  defaultValue = '../../assets/img/unknown_person.png';

  constructor(
    private router: Router
  ) { }

  ngOnInit() {}


}

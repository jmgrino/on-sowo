import { Router } from '@angular/router';
import { Partnership } from './../partnership.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-partnership-card',
  templateUrl: './partnership-card.component.html',
  styleUrls: ['./partnership-card.component.scss'],
})
export class PartnershipCardComponent implements OnInit {
  @Input() partnership: Partnership;
  defaultValue = '../../assets/img/unknown.png';

  constructor(
    private router: Router
  ) { }

  ngOnInit() {}

}

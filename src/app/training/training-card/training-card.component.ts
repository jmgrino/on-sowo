import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from '../course.model';

@Component({
  selector: 'app-training-card',
  templateUrl: './training-card.component.html',
  styleUrls: ['./training-card.component.scss'],
})
export class TrainingCardComponent implements OnInit {
  @Input() course: Course;
  defaultValue = '../../assets/img/unknown_training.png';

  constructor(
    private router: Router
  ) { }

  ngOnInit() {}

}

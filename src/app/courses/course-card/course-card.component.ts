import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from '../course.model';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss'],
})
export class CourseCardComponent implements OnInit {
  @Input() course: Course;
  defaultValue = '../../assets/img/unknown_training.png';

  constructor(
    private router: Router
  ) { }

  ngOnInit() {}

}

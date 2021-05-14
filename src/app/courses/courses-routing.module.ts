import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedGuard } from '../shared/shared.guard';
import { CourseComponent } from './course/course.component';

import { CoursesPage } from './courses.page';
import { VideoComponent } from './../shared/video/video.component';

const routes: Routes = [
  {
    path: '',
    component: CoursesPage,
    canActivate: [SharedGuard]
  },
  {
    path: ':id',
    component: CourseComponent,
    canActivate: [SharedGuard]
  },
  {
    path: 'video/:id',
    component: VideoComponent,
    canActivate: [SharedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoursesPageRoutingModule {}

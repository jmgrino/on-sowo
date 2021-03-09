import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CoursesPageRoutingModule } from './courses-routing.module';

import { SharedModule } from '../shared/shared.module';
import { CoursesPage } from './courses.page';
import { CourseCardComponent } from './course-card/course-card.component';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CoursesPageRoutingModule
  ],
  declarations: [CoursesPage, CourseCardComponent]
})
export class CoursesPageModule {}
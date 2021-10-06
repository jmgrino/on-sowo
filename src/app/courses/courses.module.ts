import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CoursesPageRoutingModule } from './courses-routing.module';

import { SharedModule } from '../shared/shared.module';
import { CoursesPage } from './courses.page';
import { CourseCardComponent } from './course-card/course-card.component';
import { ShowdownModule } from 'ngx-showdown';

import { CourseComponent } from './course/course.component';
import { EditDialogModule } from '../shared/edit-dialog/edit-dialog.module';
import { EditBannerModule } from './../shared/edit-banner/edit-banner.module';
import { VideoModule } from './../shared/video/video.module';
import { TemplatesModule } from '../templates/templates.module';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CoursesPageRoutingModule,
    ShowdownModule,
    EditDialogModule,
    EditBannerModule,
    VideoModule,
    TemplatesModule,
  ],
  declarations: [CoursesPage, CourseCardComponent, CourseComponent]
})
export class CoursesPageModule {}

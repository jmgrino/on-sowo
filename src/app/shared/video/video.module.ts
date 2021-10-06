import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared.module';
import { VideoComponent } from './video.component';
import { TemplatesModule } from './../../templates/templates.module';



@NgModule({
  declarations: [VideoComponent],
  imports: [
    SharedModule,
    IonicModule,
    TemplatesModule,
  ],
  exports: [VideoComponent]
})
export class VideoModule { }

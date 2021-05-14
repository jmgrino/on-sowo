import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared.module';
import { VideoComponent } from './video.component';



@NgModule({
  declarations: [VideoComponent],
  imports: [
    SharedModule,
    IonicModule
  ],
  exports: [VideoComponent]
})
export class VideoModule { }

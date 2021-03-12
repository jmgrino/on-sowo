import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { EditBannerComponent } from './edit-banner.component';


@NgModule({
  declarations: [EditBannerComponent],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [EditBannerComponent]
})
export class EditBannerModule { }

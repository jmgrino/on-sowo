import { EditBannerModule } from './../../shared/edit-banner/edit-banner.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { OnsowerComponent } from './onsower.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [OnsowerComponent],
  imports: [
    SharedModule,
    IonicModule,
    EditBannerModule
  ],
  exports: [OnsowerComponent]
})
export class OnsowerModule { }

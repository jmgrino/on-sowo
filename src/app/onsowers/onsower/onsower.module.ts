import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { OnsowerComponent } from './onsower.component';
import { EditBannerComponent } from '../../shared/edit-banner/edit-banner.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [OnsowerComponent, EditBannerComponent],
  imports: [
    SharedModule,
    IonicModule,
  ],
  exports: [OnsowerComponent, EditBannerComponent]
})
export class OnsowerModule { }

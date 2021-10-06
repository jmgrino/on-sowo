import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from './../../shared/shared.module';
import { OnsowerComponent } from './onsower.component';
import { EditBannerModule } from './../../shared/edit-banner/edit-banner.module';
import { TemplatesModule } from './../../templates/templates.module';


@NgModule({
  declarations: [OnsowerComponent],
  imports: [
    SharedModule,
    IonicModule,
    EditBannerModule,
    TemplatesModule,
  ],
  exports: [OnsowerComponent]
})
export class OnsowerModule { }

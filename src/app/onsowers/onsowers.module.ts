import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OnsowersPageRoutingModule } from './onsowers-routing.module';
import { SharedModule } from '../shared/shared.module';

import { OnsowersPage } from './onsowers.page';
import { OnsowerComponent } from './onsower/onsower.component';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    OnsowersPageRoutingModule
  ],
  declarations: [OnsowersPage, OnsowerComponent]
})
export class OnsowersPageModule {}

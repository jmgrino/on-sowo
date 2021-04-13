import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PartnershipsPageRoutingModule } from './partnerships-routing.module';

import { PartnershipsPage } from './partnerships.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PartnershipsPageRoutingModule
  ],
  declarations: [PartnershipsPage]
})
export class PartnershipsPageModule {}

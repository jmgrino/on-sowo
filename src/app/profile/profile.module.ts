import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { SharedModule } from '../shared/shared.module';
import { ShowdownModule } from 'ngx-showdown';
import { ProfilePage } from './profile.page';
import { OnsowerModule } from '../onsowers/onsower/onsower.module';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    ShowdownModule,
    OnsowerModule,
  ],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}

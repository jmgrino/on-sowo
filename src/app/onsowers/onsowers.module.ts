import { EditBannerComponent } from './../onsowers/edit-banner/edit-banner.component';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OnsowersPageRoutingModule } from './onsowers-routing.module';
import { SharedModule } from '../shared/shared.module';

import { OnsowersPage } from './onsowers.page';
import { OnsowerCardComponent } from './onsower-card/onsower-card.component';
import { OnsowerComponent } from './onsower/onsower.component';
import { ShowdownModule } from 'ngx-showdown';
import { OnsowerDialogComponent } from './onsower-dialog/onsower-dialog.component';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    OnsowersPageRoutingModule,
    ShowdownModule
  ],
  declarations: [OnsowersPage, OnsowerComponent,OnsowerCardComponent, EditBannerComponent, OnsowerDialogComponent],
})
export class OnsowersPageModule {}

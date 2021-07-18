import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OnsowersPageRoutingModule } from './onsowers-routing.module';
import { SharedModule } from '../shared/shared.module';

import { OnsowersPage } from './onsowers.page';
import { OnsowerInitComponent } from './onsower-init/onsower-init.component';
import { OnsowerCardComponent } from './onsower-card/onsower-card.component';
import { OnsowerDialogComponent } from './onsower-dialog/onsower-dialog.component';

import { ShowdownModule } from 'ngx-showdown';
import { OnsowerModule } from './onsower/onsower.module';


@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    OnsowersPageRoutingModule,
    ShowdownModule,
    OnsowerModule,
  ],
  declarations: [OnsowersPage , OnsowerInitComponent, OnsowerCardComponent, OnsowerDialogComponent],
})
export class OnsowersPageModule {}

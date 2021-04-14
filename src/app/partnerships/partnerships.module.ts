import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PartnershipsPageRoutingModule } from './partnerships-routing.module';

import { PartnershipsPage } from './partnerships.page';
import { SharedModule } from '../shared/shared.module';
import { PartnershipCardComponent } from './partnership-card/partnership-card.component';
import { PartnershipComponent } from './partnership/partnership.component';
import { ShowdownModule } from 'ngx-showdown';
import { EditDialogModule } from '../shared/edit-dialog/edit-dialog.module';
import { EditBannerModule } from './../shared/edit-banner/edit-banner.module';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PartnershipsPageRoutingModule,
    ShowdownModule,
    EditDialogModule,
    EditBannerModule
  ],
  declarations: [PartnershipsPage, PartnershipCardComponent, PartnershipComponent]
})
export class PartnershipsPageModule {}

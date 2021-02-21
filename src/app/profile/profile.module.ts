import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { EditBannerComponent } from './edit-banner/edit-banner.component';
import { ProfileDialogComponent } from './profile-dialog/profile-dialog.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProfilePageRoutingModule,

  ],
  declarations: [
    ProfilePage,
    EditBannerComponent,
    ProfileDialogComponent
  ]
})
export class ProfilePageModule {}

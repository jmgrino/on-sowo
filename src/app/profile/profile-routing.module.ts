import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedGuard } from '../shared/shared.guard';

import { OnsowerComponent } from '../onsowers/onsower/onsower.component';
import { ProfilePage } from './profile.page';

const routes: Routes = [
  {
    path: '',
    component: OnsowerComponent,
    canActivate: [SharedGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}

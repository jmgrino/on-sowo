import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedGuard } from '../shared/shared.guard';
import { PartnershipComponent } from './partnership/partnership.component';

import { PartnershipsPage } from './partnerships.page';

const routes: Routes = [
  {
    path: '',
    component: PartnershipsPage,
    canActivate: [SharedGuard]
  },
  {
    path: ':id',
    component: PartnershipComponent,
    canActivate: [SharedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartnershipsPageRoutingModule {}

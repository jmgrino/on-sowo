import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedGuard } from '../shared/shared.guard';
import { OnsowerInitComponent } from './onsower-init/onsower-init.component';
import { OnsowerComponent } from './onsower/onsower.component';

import { OnsowersPage } from './onsowers.page';

const routes: Routes = [
  {
    path: '',
    component: OnsowersPage,
    canActivate: [SharedGuard]
  },
  {
    path: 'init',
    component: OnsowerInitComponent,
    canActivate: [SharedGuard]
  },
  {
    path: ':id',
    component: OnsowerComponent,
    canActivate: [SharedGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnsowersPageRoutingModule {}

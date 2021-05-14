import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedGuard } from '../shared/shared.guard';

import { CommunityPage } from './community.page';

const routes: Routes = [
  {
    path: '',
    component: CommunityPage,
    canActivate: [SharedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunityPageRoutingModule {}

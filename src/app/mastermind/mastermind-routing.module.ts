import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedGuard } from '../shared/shared.guard';

import { MastermindPage } from './mastermind.page';

const routes: Routes = [
  {
    path: '',
    component: MastermindPage,
    canActivate: [SharedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MastermindPageRoutingModule {}

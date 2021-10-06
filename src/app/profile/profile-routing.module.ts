import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedGuard } from '../shared/shared.guard';

import { OnsowerComponent } from '../onsowers/onsower/onsower.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { OnsowerInitComponent } from '../onsowers/onsower-init/onsower-init.component';

const routes: Routes = [
  {
    path: '',
    component: OnsowerComponent,
    canActivate: [SharedGuard]
  },
  {
    path: 'welcome',
    component: WelcomeComponent,
    // canActivate: [SharedGuard]
  },
  {
    path: 'init',
    component: OnsowerInitComponent,
    canActivate: [SharedGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedGuard } from '../shared/shared.guard';

import { EventsPage } from './events.page';
import { EventComponent } from './event/event.component';

const routes: Routes = [
  {
    path: '',
    component: EventsPage,
    canActivate: [SharedGuard]
  },
  {
    path: ':id',
    component: EventComponent,
    canActivate: [SharedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsPageRoutingModule {}

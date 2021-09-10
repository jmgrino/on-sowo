import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventsPageRoutingModule } from './events-routing.module';

import { EventsPage } from './events.page';
import { SharedModule } from '../shared/shared.module';
import { ShowdownModule } from 'ngx-showdown';

import { EventComponent } from './event/event.component';
import { EditBannerModule } from '../shared/edit-banner/edit-banner.module';
import { EditDialogModule } from '../shared/edit-dialog/edit-dialog.module';
import { EventDialogComponent } from './event-dialog/event-dialog.component';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EventsPageRoutingModule,
    ShowdownModule,
    EditDialogModule,
    EditBannerModule
  ],
  declarations: [EventsPage, EventComponent, EventDialogComponent]
})
export class EventsPageModule {}

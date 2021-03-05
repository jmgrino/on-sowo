import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainingPageRoutingModule } from './training-routing.module';

import { SharedModule } from '../shared/shared.module';
import { TrainingPage } from './training.page';
import { TrainingCardComponent } from './training-card/training-card.component';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TrainingPageRoutingModule
  ],
  declarations: [TrainingPage, TrainingCardComponent]
})
export class TrainingPageModule {}

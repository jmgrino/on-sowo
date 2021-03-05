import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MastermindPageRoutingModule } from './mastermind-routing.module';

import { MastermindPage } from './mastermind.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MastermindPageRoutingModule
  ],
  declarations: [MastermindPage]
})
export class MastermindPageModule {}

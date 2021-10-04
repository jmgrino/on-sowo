import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MastermindPageRoutingModule } from './mastermind-routing.module';

import { MastermindPage } from './mastermind.page';
import { TemplatesModule } from '../templates/templates.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MastermindPageRoutingModule,
    TemplatesModule
  ],
  declarations: [MastermindPage]
})
export class MastermindPageModule {}

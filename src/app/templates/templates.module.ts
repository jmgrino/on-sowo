import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { StdHeaderComponent } from './std-header/std-header.component';
import { StdFooterComponent } from './std-footer/std-footer.component';

// import { MaterialModule } from './../material.module';


@NgModule({
  declarations: [StdHeaderComponent, StdFooterComponent],
  imports: [
    CommonModule,
    IonicModule,
    // MaterialModule,
  ],
  exports: [
    CommonModule,
    IonicModule,
    // MaterialModule,
    StdHeaderComponent,
    StdFooterComponent
  ]
})
export class TemplatesModule { }

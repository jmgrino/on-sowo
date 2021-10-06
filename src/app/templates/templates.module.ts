import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { StdHeaderComponent } from './std-header/std-header.component';
import { StdFooterComponent } from './std-footer/std-footer.component';
import { HeaderButtonComponent } from './header-button/header-button.component';

// import { MaterialModule } from './../material.module';


@NgModule({
  declarations: [StdHeaderComponent, StdFooterComponent, HeaderButtonComponent],
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
    StdFooterComponent,
    HeaderButtonComponent,
  ]
})
export class TemplatesModule { }

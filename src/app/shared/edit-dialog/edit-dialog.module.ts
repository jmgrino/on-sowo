import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared.module';
import { EditDialogComponent } from './edit-dialog.component';



@NgModule({
  declarations: [EditDialogComponent],
  imports: [
    SharedModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [EditDialogComponent]
})
export class EditDialogModule { }

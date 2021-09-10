import { NgModule } from '@angular/core';

import {MatBadgeModule} from '@angular/material/badge';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
// import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
// import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
// import {MatListModule} from '@angular/material/list';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';

import { MatMomentDateModule } from '@angular/material-moment-adapter';


@NgModule({
  imports: [
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    // MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    // MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    // MatListModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    MatTooltipModule,
    MatMomentDateModule,
  ],
  exports: [
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    // MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    // MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    // MatListModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    MatTooltipModule,
    MatMomentDateModule,
  ]
})
export class MaterialModule { }

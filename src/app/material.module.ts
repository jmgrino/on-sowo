import { NgModule } from '@angular/core';

// import {MatBadgeModule} from '@angular/material/badge';
import {MatButtonModule} from '@angular/material/button';
// import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
// import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
// import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
// import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';

// import { MatMomentDateModule } from '@angular/material-moment-adapter';


@NgModule({
  imports: [
    // MatBadgeModule,
    MatButtonModule,
    // MatCardModule,
    MatCheckboxModule,
    // MatDatepickerModule,
    MatDialogModule,
    // MatDividerModule,
    MatFormFieldModule,
    // MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    // MatMomentDateModule,
  ],
  exports: [
    // MatBadgeModule,
    MatButtonModule,
    // MatCardModule,
    MatCheckboxModule,
    // MatDatepickerModule,
    MatDialogModule,
    // MatDividerModule,
    MatFormFieldModule,
    // MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    // MatMomentDateModule,
  ]
})
export class MaterialModule { }

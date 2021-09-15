import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { concatMap, last } from 'rxjs/operators';
import { StorageService } from 'src/app/shared/storage.service';
import { UIService } from 'src/app/shared/ui.service';

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/

const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


export interface EditDialogData {
  property: string;
  label: string;
  value: any;
  unfilled: string;
  type: string;
  defaultValue: string;
  id?: string;
  options?: string[];
  folder?: string;
  item?: string;
}

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class EditDialogComponent implements OnInit {
  dialogForm: FormGroup;
  labelText: string;
  data: EditDialogData;
  imageUrl: string;
  uploadPercent$: Observable<number>;
  downloadURL: Observable<string>;
  dataSource: MatTableDataSource<any>;
  options = [];
  fileTitle = '';
  fileUrl: string;
  // displayedColumns = ['key', 'link'];
  // displayedListColumns = ['title', 'description'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<Component>,
    @Inject(MAT_DIALOG_DATA) data: EditDialogData,
    private storageService: StorageService,
    private uiService: UIService
  ) {

    this.data = data;

    switch (data.type) {

      case 'badge':
        this.dialogForm = this.fb.group({
          badges:  this.fb.array([]),
        });
        this.fillArray();
        break;

      case 'img':
        this.imageUrl = data.value;
        this.dialogForm = this.fb.group({
          loadImage: [null]
        });
        break;

        case 'icons':

        break;

      case 'list':

        break;

      case 'combo':
        this.options = data.options;
        this.dialogForm = this.fb.group({
          editText: [data.value]
        });

        break;

        case 'link':
          // const urlVal = '^(http[s]?://){0,1}(www.){0,1}[a-zA-Z0-9.-]+.[a-zA-Z]{2,5}[.]{0,1}';
          const urlVal = '^(http[s]?://){0,1}(www.){0,1}[a-zA-Z0-9.-]+/[\x20-\xFF]+';

            this.dialogForm = this.fb.group({
              editText: [data.value, [Validators.pattern(urlVal)]]
            });


          break;


      default: // Text, link, textarea...
        this.dialogForm = this.fb.group({
          editText: [data.value]
        });

    }


  }

  ngOnInit() {}


  fillArray() {
    const badges: FormArray = this.dialogForm.get('badges') as FormArray;
    for (const badge of this.data.value) {
      badges.push(new FormControl(badge.checked));
    }
  }

  onChange(e, i) {
    this.dialogForm.value.badges[i] = e.checked;
  }

  chosenYearHandler(normalizedYear: moment.Moment) {
    const ctrlValue: moment.Moment = this.dialogForm.value.editText;
    ctrlValue.year(normalizedYear.year());
    this.dialogForm.setValue({editText: ctrlValue});
  }

  chosenMonthHandler(normalizedMonth: moment.Moment, datepicker: MatDatepicker<moment.Moment>) {
    const ctrlValue: moment.Moment = this.dialogForm.value.editText;
    ctrlValue.month(normalizedMonth.month());
    this.dialogForm.setValue({editText: ctrlValue})
    // datepicker.close();
  }

  onChangeDate(event) {
    const ctrlValue: moment.Moment = this.dialogForm.value.date;

  }

  uploadFile(event, fileType) {

    const file: File = event.target.files[0];

    if (!file.name) {
      return;
    }

    this.fileTitle = file.name;

    const fileExt = file.name.split('.').pop();
    const fileName = fileType + '-' + this.data.item + '-' + this.data.property + '.' + fileExt;
    const filePath = `${this.data.folder}/${this.data.id}/${fileName}`;

    let fileOK = false;

    if (fileType === "img") {
      if (file.type.split('/')[0] !== 'image') {
        this.uiService.showStdSnackbar('Solo imagenes');
      } else if (file.size >= (2 * 1024 * 1024) ) {
        this.uiService.showStdSnackbar('Imagen demasiado grande. Debe ser menor de 2 MBytes');
      } else  {
        fileOK = true;
      }
    } else if (fileType === "pdf") {
      if (file.type.split('/')[1] !== 'pdf') {
        this.uiService.showStdSnackbar('Solo ficheros pdf');
      } else if (file.size >= (2 * 1024 * 1024) ) {
        this.uiService.showStdSnackbar('Imagen demasiado grande. Debe ser menor de 2 MBytes');
      } else  {
        fileOK = true;
      }
    }

    if (fileOK) {
      const task = this.storageService.uploadFile(filePath, file);
      this.uploadPercent$ = task.percentageChanges();

      task.snapshotChanges().pipe(
        last(),
        concatMap( () => this.storageService.getDownloadURL(filePath) )
      ).subscribe(  url => {
        if (fileType === 'img') {
          this.imageUrl = url;
        } else if (fileType === "pdf") {
          this.fileUrl = url;
        }
      }, error => {
        const message = this.uiService.translateStorageError(error);
        this.uiService.showStdSnackbar(message);
      });
    }
  }

  onSubmit() {
    switch (this.data.type) {

      case 'img':
        this.dialogRef.close(this.imageUrl);
        break;

      case 'badge':
        const badgeResult = [];
        for (let i = 0; i < this.dialogForm.value.badges.length; i++) {
          if (this.dialogForm.value.badges[i]) {
            badgeResult.push(this.data.value[i].name);
            // badgeResult.push(this.data.value[i]['name']);
          }
        }
        this.dialogRef.close(badgeResult);
        break;

      case 'link':
        this.dialogRef.close(this.dialogForm.value.editText.replace(/(^\w+:|^)\/\//, ''));
        break;

      case 'icons':

        break;

      case 'list':

        break;

      case 'file':
        this.dialogRef.close(this.fileUrl);
        break;

      default:
        this.dialogRef.close(this.dialogForm.value.editText);

    }

  }


  close() {
    this.dialogRef.close(null);
  }



}

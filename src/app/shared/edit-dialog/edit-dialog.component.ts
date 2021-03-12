import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { concatMap, last } from 'rxjs/operators';
import { StorageService } from 'src/app/shared/storage.service';
import { UIService } from 'src/app/shared/ui.service';

export interface EditDialogData {
  property: string;
  label: string;
  value: any;
  unfilled: string;
  type: string;
  defaultValue: string;
  uid?: string;
  options?: string[];
}

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss'],
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

      case 'badget':
        this.dialogForm = this.fb.group({
          badgets:  this.fb.array([]),
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

      default: // Text, link, ...
        this.dialogForm = this.fb.group({
          editText: [data.value]
        });

    }


  }

  ngOnInit() {}


  fillArray() {
    const badgets: FormArray = this.dialogForm.get('badgets') as FormArray;
    for (const badget of this.data.value) {
      badgets.push(new FormControl(badget.checked));
    }
  }

  onChange(e, i) {
    this.dialogForm.value.badgets[i] = e.checked;
  }

  uploadPostImage(event) {
    const file: File = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = 'avatar.' + fileExt;
    const filePath = `users/${this.data.uid}/${fileName}`;
    if (file.type.split('/')[0] !== 'image') {
      return alert('only image files');
    } else if (file.size >= (2 * 1024 * 1024) ) {
      this.uiService.showStdSnackbar('Imagen demasiado grande. Debe ser menor de 2 MBytes');
    } else {
      const task = this.storageService.uploadFile(filePath, file);
      this.uploadPercent$ = task.percentageChanges();

      task.snapshotChanges().pipe(
        last(),
        concatMap( () => this.storageService.getDownloadURL(filePath) )
      ).subscribe(  url => {
        this.imageUrl = url;
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

      case 'badget':
        const badgetResult = [];
        for (let i = 0; i < this.dialogForm.value.badgets.length; i++) {
          if (this.dialogForm.value.badgets[i]) {
            badgetResult.push(this.data.value[i].area);
            // badgetResult.push(this.data.value[i]['area']);
          }
        }
        this.dialogRef.close(badgetResult);
        break;

      case 'link':
        this.dialogRef.close(this.dialogForm.value.editText.replace(/(^\w+:|^)\/\//, ''));
        break;

      case 'icons':

        break;

      case 'list':

        break;

      default:
        this.dialogRef.close(this.dialogForm.value.editText);

    }

  }


  close() {
    this.dialogRef.close(null);
  }



}

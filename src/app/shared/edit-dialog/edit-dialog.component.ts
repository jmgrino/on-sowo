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
  id?: string;
  options?: string[];
  folder?: string;
  item?: string;
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

  uploadFile(event, fileType) {

    const file: File = event.target.files[0];

    if (!file.name) {
      return;
    }

    this.fileTitle = file.name;

    const fileExt = file.name.split('.').pop();
    // const fileName = fileType + '-course.' + fileExt;
    // const filePath = `courses/${this.data.id}/${fileName}`;
    const fileName = fileType + '-' + this.data.item + '.' + fileExt;
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
  // uploadPostImage(event) {
  //   const file: File = event.target.files[0];
  //   const fileExt = file.name.split('.').pop();
  //   const fileName = 'course.' + fileExt;
  //   const filePath = `courses/${this.data.id}/${fileName}`;
  //   if (file.type.split('/')[0] !== 'image') {
  //     return alert('only image files');
  //   } else if (file.size >= (2 * 1024 * 1024) ) {
  //     this.uiService.showStdSnackbar('Imagen demasiado grande. Debe ser menor de 2 MBytes');
  //   } else {
  //     const task = this.storageService.uploadFile(filePath, file);
  //     this.uploadPercent$ = task.percentageChanges();

  //     task.snapshotChanges().pipe(
  //       last(),
  //       concatMap( () => this.storageService.getDownloadURL(filePath) )
  //     ).subscribe(  url => {
  //       this.imageUrl = url;
  //     }, error => {
  //       const message = this.uiService.translateStorageError(error);
  //       this.uiService.showStdSnackbar(message);
  //     });
  //   }
  // }

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

import { Component, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { concatMap, last } from 'rxjs/operators';
import { StorageService } from 'src/app/shared/storage.service';
import { MyErrorStateMatcher, UIService } from 'src/app/shared/ui.service';
import { DialogData } from '../onsower/onsower.component';


@Component({
  selector: 'app-onsower-dialog',
  templateUrl: './onsower-dialog.component.html',
  styleUrls: ['./onsower-dialog.component.scss'],
})
export class OnsowerDialogComponent implements OnInit {
  @ViewChildren(MatCheckbox) areasCheckbox: QueryList<MatCheckbox>;

  dialogForm: FormGroup;
  labelText: string;
  data: DialogData;
  imageUrl: string;
  uploadPercent$: Observable<number>;
  downloadURL: Observable<string>;
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['key', 'link'];
  displayedListColumns = ['title', 'description'];

  matcher = new MyErrorStateMatcher();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<OnsowerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: DialogData,
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
        this.dialogForm = this.fb.group({
          socials: this.fb.array([]),
        });

        for (const property in data.value as object) {
          this.addSocial(property, data.value[property]);
        }

        this.dataSource = new MatTableDataSource((this.dialogForm.get('socials') as FormArray).controls);
        break;

      case 'list':
        this.dialogForm = this.fb.group({
          curiosities: this.fb.array([]),
        });

        for (const curiosity of data.value) {
          this.addCuriosity(curiosity.title, curiosity.description);
        }

        this.dataSource = new MatTableDataSource((this.dialogForm.get('curiosities') as FormArray).controls);

        break;

      case 'link':
        // const urlVal = '^(http[s]?://){0,1}(www.){0,1}[a-zA-Z0-9.-]+.[a-zA-Z]{2,5}[.]{0,1}';
        const urlVal = '^(http[s]?://){0,1}(www.){0,1}[a-zA-Z0-9.-]+/[\x20-\xFF]+';
        if (this.data.maxLength == 0) {
          this.dialogForm = this.fb.group({
            editText: [data.value, [Validators.pattern(urlVal)]]
          });
        } else {
          this.dialogForm = this.fb.group({
            editText: [data.value, [Validators.maxLength(this.data.maxLength), Validators.pattern(urlVal)]]
          });
        }

        break;


      default: // Text, link, textarea...
        if (this.data.maxLength == 0) {
          this.dialogForm = this.fb.group({
            editText: [data.value]
          });
        } else {
          this.dialogForm = this.fb.group({
            editText: [data.value, [Validators.maxLength(this.data.maxLength)]]
          });
        }

    }


  }

  ngOnInit() {}

  get socials(): FormArray {
    return this.dialogForm.get('socials') as FormArray;
  }

  addSocial(key: string, link: string) {
    // const urlVal = '^(http[s]?://){0,1}(www.){0,1}[a-zA-Z0-9.-]+.[a-zA-Z]{2,5}[.]{0,1}';
    const urlVal = '^(http[s]?://){0,1}(www.){0,1}[a-zA-Z0-9.-]+/[\x20-\xFF]+';
    this.socials.push(this.fb.group({
      key,
      link: [link, [Validators.pattern(urlVal)]]
    }));
  }

  get curiosities(): FormArray {
    return this.dialogForm.get('curiosities') as FormArray;
  }

  addCuriosity(title: string, description: string) {
    if (this.data.maxLength == 0) {
      this.curiosities.push(this.fb.group({
        title,
        description
      }));
    } else {
      this.curiosities.push(this.fb.group({
        title,
        description: [description, [Validators.maxLength(this.data.maxLength)]]
      }));
    }
  }

  fillArray() {
    const badgets: FormArray = this.dialogForm.get('badgets') as FormArray;
    for (const badget of this.data.value) {
      badgets.push(new FormControl(badget.checked));
    }
  }



  onChange(e, i) {
    if (this.dialogForm.value.badgets.filter( (area, index) => {
      if (index === i) {
        return e.checked;
      } else {
        return area;
      }
    }).length > this.data.maxLength) {
      const message = 'Puedes elegir ' + this.data.maxLength + ' areas como máximo';
      this.uiService.showStdSnackbar(message);
      this.areasCheckbox.forEach((directive, index) => {
        if (index === i) {
          directive.checked = false;
        }
      });
    } else {
      this.dialogForm.value.badgets[i] = e.checked;
    }
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
    if (!this.dialogForm.valid) {
      const message = 'Hay errores en el formulario';
      this.uiService.showStdSnackbar(message);
      return
    }

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
        const socials = this.dialogForm.value.socials;
        const iconsResult = {};

        // if (obj.hasOwnProperty(prop)) {
        // }
        for (let i = 0; i < socials.length; i++) {
          if (socials[i].link) {
            iconsResult[socials[i].key] = socials[i].link.replace(/(^\w+:|^)\/\//, '');
          }
        }
        this.dialogRef.close(iconsResult);
        break;

      case 'list':
        const curiositiesResult = [];
        for (let i = 0; i < this.dialogForm.value.curiosities.length; i++) {
          if (this.dialogForm.value.curiosities[i].description.trim().length > 0) {
            curiositiesResult.push({
              order: i,
              title: this.dialogForm.value.curiosities[i].title,
              description: this.dialogForm.value.curiosities[i].description,
            });
          }
        }

        this.dialogRef.close(curiositiesResult);

        break;

      default:
        this.dialogRef.close(this.dialogForm.value.editText);

    }

  }

  close() {
    this.dialogRef.close(null);
  }

}


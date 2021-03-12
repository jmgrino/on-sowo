import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ShowdownConverter } from 'ngx-showdown';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { DataService } from 'src/app/shared/data.service';
import { EditDialogComponent } from 'src/app/shared/edit-dialog/edit-dialog.component';
import { UIService } from 'src/app/shared/ui.service';
import { Course } from '../course.model';
import { CoursesService } from '../courses.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
})
export class CourseComponent implements OnInit {
  user: User;
  id: string;
  course: Course;
  editing = false;
  canEdit = false;

  fields = {
    id: {
      property: 'uid',
      label: 'uid',
      value: '',
      unfilled: true,
      type: 'readonly',
      defaultValue: '',
    },
    name: {
      property: 'name',
      label: 'Nombre del curso',
      value: '',
      unfilled: true,
      type: 'text',
      defaultValue: '',
    },
    photoUrl: {
      property: 'photoUrl',
      label: 'photoUrl',
      value: '',
      unfilled: false,
      type: 'img',
      defaultValue: '../../assets/img/unknown_training.png',
    },
    description: {
      property: 'description',
      label: 'Description',
      value: '',
      unfilled: true,
      type: 'text',
      defaultValue: '',
    },
    areas: {
      property: 'areas',
      label: 'Areas de formación',
      value: [],
      unfilled: true,
      type: 'badget',
      defaultValue: '',
    },
    trainingType: {
      property: 'trainingType',
      label: 'Tipo de formación',
      value: '',
      unfilled: true,
      type: 'combo',
      defaultValue: '',
    },
    author: {
      property: 'author',
      label: 'Autor',
      value: '',
      unfilled: true,
      type: 'text',
      defaultValue: '',
    },
    duration: {
      property: 'duration',
      label: 'Duración',
      value: '',
      unfilled: true,
      type: 'text',
      defaultValue: '',
    },

  };

  trainingAreas: string[];
  trainingTypes: string[];


  constructor(
    private auth: AuthService,
    private sidemenu: MenuController,
    private dialog: MatDialog,
    private uiService: UIService,
    private coursesService: CoursesService,
    private dataService: DataService,
    private showdownConverter: ShowdownConverter,
    private route: ActivatedRoute,

  ) { }

  ngOnInit() {
    this.trainingAreas = this.dataService.getTrainingAreas();
    this.trainingTypes = this.dataService.getTrainingTypes();

    this.id = this.route.snapshot.paramMap.get('id');

    this.auth.getCurrentUser().subscribe( user => {
      if (user) {
        this.user = user;
        if (user.isAdmin) {
          this.canEdit = true;
        }
        this.coursesService.fetchCourse(this.id).subscribe( course => {
          this.course = course;

          for (const property in this.course) {
            if (this.fields[property] !== undefined) {
              this.fields[property].value = this.course[property];
              if (this.course[property].length > 0) {
                this.fields[property].unfilled = false;
              } else {
                this.fields[property].unfilled = true;
              }
            }
          }

        }, error => {
          const message = this.uiService.translateFirestoreError(error);
          this.uiService.showStdSnackbar(message);
        });
      }
    });


  }

  ionViewWillEnter() {
    this.sidemenu.enable(true);
  }

  onEdit() {
    this.editing = true;
  }

  onDone() {
    this.editing = false;
  }

  onEditField(field) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop = true;
    // dialogConfig.closeOnNavigation = false;

    dialogConfig.data = {
      id: this.id,
      ...field
    };

    switch (dialogConfig.data.type) {
      case 'text':
        dialogConfig.width = '400px';
        break;

      case 'textarea':
        dialogConfig.width = '600px';
        dialogConfig.height = '400px';
        break;

      case 'badget':
        const checklist = [];
        let checked: boolean;
        for (const area of this.trainingAreas) {
          checked = dialogConfig.data.value.includes(area);
          checklist.push({
            area,
            checked
          });
        }
        dialogConfig.data.value = checklist;

        break;

      case 'combo':
        dialogConfig.width = '400px';
        if (dialogConfig.data.property === 'trainingType') {
        dialogConfig.data.options = this.trainingTypes;
        }
        break;

      case 'img':
        alert('Edit not implemented');
        return;

        break;

      case 'link':
        dialogConfig.width = '400px';
        break;

      case 'icons':
        alert('Edit not implemented');
        return;

        break;

      case 'list':
        alert('Edit not implemented');
        return;

        break;

      default:
        alert('Edit not implemented');
        return;
    }

    this.dialog.open(EditDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe( newValue => {
        if (newValue !== null) {
          if (newValue !== dialogConfig.data.value) {
            this.coursesService.saveCourse(dialogConfig.data.id, {
              [dialogConfig.data.property]: newValue
            }).subscribe( () => {},
            error => {
              const message = this.uiService.translateFirestoreError(error);
              this.uiService.showStdSnackbar(message);
            });
          }
        }
      });

  }


}

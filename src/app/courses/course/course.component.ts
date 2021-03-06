import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { ShowdownConverter } from 'ngx-showdown';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { DataService } from 'src/app/shared/data.service';
import { EditDialogComponent } from 'src/app/shared/edit-dialog/edit-dialog.component';
import { UIService } from 'src/app/shared/ui.service';
import { Course } from '../course.model';
import { CoursesService } from '../courses.service';
import { StorageService } from './../../shared/storage.service';
// import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
})
export class CourseComponent implements OnInit, OnDestroy {
  user: User;
  id: string;
  course: Course;
  editing = false;
  canEdit = false;
  courseSubscription: Subscription;
  // safeURL: SafeResourceUrl;

  fields = {
    id: {
      property: 'uid',
      label: 'uid',
      value: '',
      unfilled: true,
      alwaysShowLabel: false,
      type: 'readonly',
      defaultValue: '',
    },
    name: {
      property: 'name',
      label: 'Nombre del curso',
      value: '',
      unfilled: true,
      alwaysShowLabel: false,
      type: 'text',
      defaultValue: '',
    },
    photoUrl: {
      property: 'photoUrl',
      label: 'Foto del curso',
      value: '',
      unfilled: false,
      alwaysShowLabel: false,
      type: 'img',
      defaultValue: '../../assets/img/unknown_training.png',
    },
    cardPhotoUrl: {
      property: 'cardPhotoUrl',
      label: 'Foto del curso para la tarjeta',
      value: '',
      unfilled: false,
      alwaysShowLabel: true,
      type: 'img',
      defaultValue: '../../assets/img/unknown_training.png',
    },
    description: {
      property: 'description',
      label: 'Description del curso',
      value: '',
      unfilled: true,
      alwaysShowLabel: false,
      type: 'textarea',
      defaultValue: '',
    },
    areas: {
      property: 'areas',
      label: 'Areas de formación',
      value: [],
      unfilled: true,
      alwaysShowLabel: false,
      type: 'badge',
      defaultValue: '',
    },
    trainingType: {
      property: 'trainingType',
      label: 'Tipo de formación',
      value: '',
      unfilled: true,
      alwaysShowLabel: false,
      type: 'combo',
      defaultValue: '',
    },
    author: {
      property: 'author',
      label: 'Autor',
      value: '',
      unfilled: true,
      alwaysShowLabel: false,
      type: 'text',
      defaultValue: '',
    },
    duration: {
      property: 'duration',
      label: 'Duración',
      value: '',
      unfilled: true,
      alwaysShowLabel: false,
      type: 'text',
      defaultValue: '',
    },
    fileUrl: {
      property: 'fileUrl',
      label: 'Pulse el botton de edición para subir el fichero Pdf',
      value: '',
      unfilled: true,
      alwaysShowLabel: true,
      type: 'file',
      defaultValue: '',
    },
    videoUrl: {
      property: 'videoUrl',
      label: 'Pulse el botton de edición para editar el enlace del video',
      value: '',
      unfilled: true,
      alwaysShowLabel: true,
      type: 'link',
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
    private storageService: StorageService,
    private showdownConverter: ShowdownConverter,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private router: Router,
    // private sanitizer: DomSanitizer,
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
        this.courseSubscription = this.coursesService.fetchCourse(this.id).subscribe( course => {
          if (course) {
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

          } else {
            this.router.navigateByUrl('/courses')

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

  async onDelete() {
    const alert = await this.alertController.create({
      cssClass: 'alert-class',
      header: 'Confirmar',
      message: '¿Borrar "' + this.course.name + '"?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'buttonsAlertLeft',
        }, {
          text: 'Si',
          cssClass: 'buttonsAlertRight',
          handler: () => {
            this.coursesService.deleteCourse(this.course.id).subscribe(
              () => {
                this.storageService.deleteFolderContents(`courses/${this.course.id}`);
                this.router.navigateByUrl('/courses');
              }, error => {
                const message = this.uiService.translateFirestoreError(error);
                this.uiService.showStdSnackbar(message);
              }
            )
          }
        }
      ]
    });

    await alert.present();
  }

  onOpenFile() {
    window.open(this.fields.fileUrl.value);
  }

  onOpenVideo() {
    // window.open('http://' + this.fields.videoUrl.value);
    this.router.navigateByUrl(`/courses/video/${this.course.id}`);

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
      case 'img':
        dialogConfig.data.item = 'course';
        dialogConfig.data.folder = 'courses';
        break;

      case 'text':
        dialogConfig.width = '400px';
        break;

      case 'textarea':
        dialogConfig.width = '600px';
        dialogConfig.height = '400px';
        break;

      case 'badge':
        const checklist = [];
        let checked: boolean;
        for (const name of this.trainingAreas) {
          checked = dialogConfig.data.value.includes(name);
          checklist.push({
            name,
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

      case 'link':
        dialogConfig.width = '600px';
        dialogConfig.data.label = 'Enlace del video'

        break;

      case 'icons':
        alert('Edit not implemented');
        return;

        break;

      case 'list':
        alert('Edit not implemented');
        return;

        break;

      case 'file':
        dialogConfig.width = '400px';
        dialogConfig.data.label = 'Fichero pdf';
        dialogConfig.data.item = 'course';
        dialogConfig.data.folder = 'courses';

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

  makeHtml(markdownText: string) {

    this.showdownConverter.setOptions({
      tables: true,
      strikethrough: true,
      noHeaderId: true,
      openLinksInNewWindow: true,
      underline: true,
      literalMidWordUnderscores: true,
      simpleLineBreaks: true,
      headerLevelStart: 4,
    });
    return this.showdownConverter.makeHtml(markdownText);

    // return result.replace(new RegExp('\n', 'g'), "<br />");

  }

  OnDiscord() {
    const discordLink = this.dataService.getDiscordLink();
    window.open(discordLink, "_blank");
  }


  ngOnDestroy() {
    this.courseSubscription.unsubscribe();
  }


}

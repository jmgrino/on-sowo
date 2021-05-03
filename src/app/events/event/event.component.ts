import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { ShowdownConverter } from 'ngx-showdown';
import { AuthService } from 'src/app/auth/auth.service';

import { User } from 'src/app/auth/user.model';
import { EditDialogComponent } from 'src/app/shared/edit-dialog/edit-dialog.component';
import { StorageService } from 'src/app/shared/storage.service';
import { UIService } from 'src/app/shared/ui.service';
import { OsEvent } from '../event.model';
import { EventsService } from '../events.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventComponent implements OnInit {
  user: User;
  id: string;
  osEvent: OsEvent;
  editing = false;
  canEdit = false;

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
      label: 'Nombre del evento',
      value: '',
      unfilled: true,
      alwaysShowLabel: false,
      type: 'text',
      defaultValue: '',
    },
    photoUrl: {
      property: 'photoUrl',
      label: 'Foto del evento',
      value: '',
      unfilled: false,
      alwaysShowLabel: false,
      type: 'img',
      defaultValue: '../../assets/img/unknown.png',
    },
    description: {
      property: 'description',
      label: 'Description del evento',
      value: '',
      unfilled: true,
      alwaysShowLabel: false,
      type: 'textarea',
      defaultValue: '',
    },
  }

  constructor(
    private auth: AuthService,
    private sidemenu: MenuController,
    private dialog: MatDialog,
    private uiService: UIService,
    private eventsService: EventsService,
    // private dataService: DataService,
    private storageService: StorageService,
    private showdownConverter: ShowdownConverter,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private router: Router,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.auth.getCurrentUser().subscribe( user => {
      if (user) {
        this.user = user;
        if (user.isAdmin) {
          this.canEdit = true;
        }

        this.eventsService.fetchEvent(this.id).subscribe( osEvent => {
          if (osEvent) {
            this.osEvent = osEvent;

            for (const property in this.osEvent) {
              if (this.fields[property] !== undefined) {
                this.fields[property].value = this.osEvent[property];
                if (this.osEvent[property].length > 0) {
                  this.fields[property].unfilled = false;
                } else {
                  this.fields[property].unfilled = true;
                }
              }
            }

          } else {
            this.router.navigateByUrl('/events')

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
    // const alert = await this.alertController.create({
    //   cssClass: 'alert-class',
    //   header: 'Confirmar',
    //   message: '¿Borrar "' + this.partnership.name + '"?',
    //   buttons: [
    //     {
    //       text: 'No',
    //       role: 'cancel',
    //       cssClass: 'buttonsAlertLeft',
    //     }, {
    //       text: 'Si',
    //       cssClass: 'buttonsAlertRight',
    //       handler: () => {
    //         this.partnershipsService.deletePartnership(this.partnership.id).subscribe(
    //           () => {
    //             this.storageService.deleteFolderContents(`partnerships/${this.partnership.id}`);
    //             this.router.navigateByUrl('/partnerships');
    //           }, error => {
    //             const message = this.uiService.translateFirestoreError(error);
    //             this.uiService.showStdSnackbar(message);
    //           }
    //         )
    //       }
    //     }
    //   ]
    // });

    // await alert.present();
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
        dialogConfig.data.item = 'event';
        dialogConfig.data.folder = 'events';
        break;

      case 'text':
        dialogConfig.width = '400px';
        break;

      case 'textarea':
        dialogConfig.width = '600px';
        dialogConfig.height = '400px';
        break;

      // case 'badge':
      //   const checklist = [];
      //   let checked: boolean;

      //   for (const name of this.partnershipTypes) {
      //     checked = dialogConfig.data.value.includes(name);
      //     checklist.push({
      //       name,
      //       checked
      //     });
      //   }
      //   dialogConfig.data.value = checklist;

      //   break;

      // case 'combo':
      //   dialogConfig.width = '400px';
      //   if (dialogConfig.data.property === 'trainingType') {
      //   dialogConfig.data.options = this.trainingTypes;
      //   }
      //   break;


      // case 'link':
      //   dialogConfig.width = '600px';
      //   dialogConfig.data.label = 'Enlace del video'

      //   break;

      // case 'icons':
      //   alert('Edit not implemented');
      //   return;

      //   break;

      // case 'list':
      //   alert('Edit not implemented');
      //   return;

      //   break;

      // case 'file':
      //   dialogConfig.width = '400px';
      //   dialogConfig.data.label = 'Fichero pdf';
      // dialogConfig.data.item = 'partnership';
      // dialogConfig.data.folder = 'partnerships';

      //   break;

      default:
        alert('Edit not implemented');
        return;
    }

    this.dialog.open(EditDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe( newValue => {
        if (newValue !== null) {
          // if (newValue !== dialogConfig.data.value) {
          //   this.partnershipsService.savePartnership(dialogConfig.data.id, {
          //     [dialogConfig.data.property]: newValue
          //   }).subscribe( () => {},
          //   error => {
          //     const message = this.uiService.translateFirestoreError(error);
          //     this.uiService.showStdSnackbar(message);
          //   });
          // }
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


}

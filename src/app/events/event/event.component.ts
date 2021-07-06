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
import { StorageService } from 'src/app/shared/storage.service';
import { UIService } from 'src/app/shared/ui.service';
import { OsEvent } from '../event.model';
import { EventsService } from '../events.service';
import * as moment from 'moment';
// import firebase from 'firebase/app';
// import 'firebase/firestore';
// import { Timestamp } from '@google-cloud/firestore';



@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventComponent implements OnInit, OnDestroy {
  user: User;
  id: string;
  osEvent: OsEvent;
  editing = false;
  canEdit = false;
  eventsSubscription: Subscription;

  fields = {
    id: {
      property: 'id',
      label: 'id',
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
    date: {
      property: 'date',
      label: 'Fecha del evento',
      value: moment(),
      unfilled: true,
      alwaysShowLabel: false,
      type: 'date',
      defaultValue: '',
    },
    hour: {
      property: 'hour',
      label: 'Hora del evento',
      value: '',
      unfilled: true,
      alwaysShowLabel: false,
      type: 'text',
      defaultValue: '',
    },
  }

  constructor(
    private auth: AuthService,
    private sidemenu: MenuController,
    private dialog: MatDialog,
    private uiService: UIService,
    private eventsService: EventsService,
    private dataService: DataService,
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

        this.eventsSubscription = this.eventsService.fetchEvent(this.id).subscribe( osEvent => {
          if (osEvent) {
            this.osEvent = osEvent;

            for (const property in this.osEvent) {
              if (this.fields[property] !== undefined) {
                if (property == 'date') {
                  this.fields[property].value = moment(this.osEvent[property].toDate());
                } else {
                  this.fields[property].value = this.osEvent[property];
                }
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
    const alert = await this.alertController.create({
      cssClass: 'alert-class',
      header: 'Confirmar',
      message: '¿Borrar "' + this.osEvent.name + '"?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'buttonsAlertLeft',
        }, {
          text: 'Si',
          cssClass: 'buttonsAlertRight',
          handler: () => {
            this.eventsService.deleteEvent(this.osEvent.id).subscribe(
              () => {
                this.storageService.deleteFolderContents(`events/${this.osEvent.id}`);
                this.router.navigateByUrl('/events');
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

  onDuplicate() {
    const dupEvent = {...this.osEvent};
    dupEvent.name = this.osEvent.name + ' COPIA';
    delete dupEvent.id;
    // console.log(dupEvent);

    this.eventsService.addEvent(dupEvent).subscribe( () => {
      this.uiService.showStdSnackbar(dupEvent.name + ' Creado')
    });


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

      case 'date':
        // dialogConfig.width = '600px';
        // dialogConfig.height = '400px';
        if (dialogConfig.data.value) {
          // Do nothing
        } else {
          dialogConfig.data.value = moment();
          dialogConfig.data.value.set({hour:0,minute:0,second:0,millisecond:0});
        }

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
          if (newValue !== dialogConfig.data.value) {
            let saveValue: any;
            if (dialogConfig.data.type == 'date') {
              saveValue = newValue.toDate();
            } else {
              saveValue = newValue;
            }
            this.eventsService.saveEvent(dialogConfig.data.id, {
              [dialogConfig.data.property]: saveValue
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

  // displayTimestamp(timestamp: firebase.firestore.Timestamp) {
  //   const timestampOptions: {day: "2-digit", month: "2-digit", year: "2-digit"} = {
  //     day: '2-digit',
  //     month: '2-digit',
  //     year: '2-digit',
  //     // hour: '2-digit',
  //     // minute: '2-digit',
  //     // second: '2-digit',
  //   }

  //   if (timestamp) {
  //     return timestamp.toDate().toLocaleString('es-ES', timestampOptions);
  //   } else {
  //     return '';
  //   }
  // }


  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }


}

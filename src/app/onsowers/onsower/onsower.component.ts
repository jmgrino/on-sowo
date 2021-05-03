import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DataService } from './../../shared/data.service';
import { OnsowersService } from './../onsowers.service';
import { UIService } from './../../shared/ui.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../auth/user.model';
import { OnsowerDialogComponent } from '../onsower-dialog/onsower-dialog.component';
import { ShowdownConverter } from 'ngx-showdown';

export interface DialogData {
  property: string;
  label: string;
  value: any;
  unfilled: string;
  type: string;
  // defaultValue: string;
  uid?: string;
}

@Component({
  selector: 'app-onsower',
  templateUrl: './onsower.component.html',
  styleUrls: ['./onsower.component.scss'],
})

export class OnsowerComponent implements OnInit, OnDestroy {
  user: User;
  onSower: User;
  editing = false;
  canEdit = true;
  canBack = false;
  socials = [];
  sowerSubscription: Subscription;


  fields = {
    uid: {
      property: 'uid',
      label: 'uid',
      value: '',
      unfilled: true,
      type: 'readonly',
      defaultValue: '',
    },
    email: {
      property: 'email',
      label: 'email',
      value: '',
      unfilled: true,
      type: 'readonly',
      defaultValue: '',
    },
    photoUrl: {
      property: 'photoUrl',
      label: 'photoUrl',
      value: '',
      unfilled: false,
      type: 'img',
      defaultValue: '../../assets/img/unknown_person.png',
    },
    displayName: {
      property: 'displayName',
      label: 'Nombre',
      value: '',
      unfilled: true,
      type: 'text',
      defaultValue: '',
    },
    familyName: {
      property: 'familyName',
      label: 'Apellidos',
      value: '',
      unfilled: true,
      type: 'text',
      defaultValue: '',
    },
    isAdmin: {
      property: 'isAdmin',
      label: 'isAdmin',
      value: false,
      unfilled: true,
      type: 'readonly',
      defaultValue: '',
    },
    jobDescription: {
      property: 'jobDescription',
      label: 'Descripción del puesto de trabajo',
      value: '',
      unfilled: true,
      type: 'text',
      defaultValue: '',
    },
    jobAdditionalDesc: {
      property: 'jobAdditionalDesc',
      label: 'Descripción adicional del puesto de trabajo',
      value: '',
      unfilled: true,
      type: 'text',
      defaultValue: '',
    },
    areas: {
      property: 'areas',
      label: 'Areas de conocimiento',
      value: [],
      unfilled: true,
      type: 'badget',
      defaultValue: '',
    },
    web: {
      property: 'web',
      label: 'Sitio web',
      value: '',
      unfilled: true,
      type: 'link',
      defaultValue: '',
    },
    socials: {
      property: 'socialLinks',
      label: 'Redes sociales',
      value: '',
      unfilled: true,
      type: 'icons',
      defaultValue: '',
    },
    country: {
      property: 'country',
      label: 'País',
      value: '',
      unfilled: true,
      type: 'text',
      defaultValue: '',
    },
    city: {
      property: 'city',
      label: 'Ciudad',
      value: '',
      unfilled: true,
      type: 'text',
      defaultValue: '',
    },
    curiosities: {
      property: 'curiosities',
      label: 'Curiosidades',
      value: [],
      unfilled: true,
      type: 'list',
      defaultValue: '',
    },
    info: {
      property: 'info',
      label: 'Un poco sobre mi y mis proyectos',
      value: '',
      unfilled: true,
      type: 'textarea',
      defaultValue: '',
    },


  };

  allAreas: string[];
  allCuriosities = [];

  allSocialLinks = [];

  constructor(
    private auth: AuthService,
    private sidemenu: MenuController,
    private dialog: MatDialog,
    private uiService: UIService,
    private onsowersService: OnsowersService,
    private dataService: DataService,
    private showdownConverter: ShowdownConverter,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.allAreas = this.dataService.getAreas();
    this.allCuriosities = this.dataService.getCuriosities();
    this.allSocialLinks = this.dataService.getSocialLinks();

    const uid = this.route.snapshot.paramMap.get('id');

    this.auth.getCurrentUser().subscribe( user => {
      if (user) {
        this.user = user;

        let onSowerId = user.uid;

        if (uid) {
          this.canBack = true;
          if ( uid !== user.uid ) {
            onSowerId = uid;
            if (!user.isAdmin) {
              this.canEdit = false;
            }
          }
        }

        this.sowerSubscription = this.onsowersService.fetchOnsower(onSowerId).subscribe( onSower => {
          this.onSower = onSower;

          // this.onSower.areas = ['Marketing','Estrategia'];
          // this.onSower.photoUrl = 'https://i.picsum.photos/id/1027/2848/4272.jpg?hmac=EAR-f6uEqI1iZJjB6-NzoZTnmaX0oI0th3z8Y78UpKM';
          if (!this.onSower.displayName) {
            this.onSower.displayName = this.onSower.email.split('@')[0];
          } else {
            if (this.onSower.displayName.trim().length === 0) {
              this.onSower.displayName = this.onSower.email.split('@')[0];
            }
          }

          for (const property in this.onSower) {
            if (this.fields[property] !== undefined) {
              this.fields[property].value = this.onSower[property];
              if (this.onSower[property].length > 0) {
                this.fields[property].unfilled = false;
              } else {
                this.fields[property].unfilled = true;
              }
            }
          }

          this.socials = [];

          for (const property in this.onSower.socialLinks) {
            const url = this.onSower.socialLinks[property];
            const icon = this.getIcon(url);
            this.socials.push({
              name: property,
              url,
              icon,
            });
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
      uid: this.onSower.uid,
      ...field
        // value: field.value,
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
        for (const area of this.allAreas) {
          checked = dialogConfig.data.value.includes(area);
          checklist.push({
            area,
            checked
          });
        }
        dialogConfig.data.value = checklist;
        break;

      case 'img':
        break;

      case 'link':
        dialogConfig.width = '400px';
        break;

      case 'icons':
        const mySocials = {};
        if (this.socials) {
          this.allSocialLinks.forEach( allSocialLink => {
            const foundSocial = this.socials.find( social => social.name === allSocialLink.name);
            if (foundSocial) {
              mySocials[allSocialLink.name] = foundSocial.url;
            } else {
              mySocials[allSocialLink.name] = '';
            }

          });
        } else {
          this.allSocialLinks.forEach( allSocialLink => {
            mySocials[allSocialLink.name] = '';
          });

        }
        dialogConfig.data.value = mySocials;

        break;


        case 'list':
          const myCuriosities = [];

          this.allCuriosities.forEach( allCuriosity => {
            const foundCuriosity = dialogConfig.data.value.find( curiosity => curiosity.order === allCuriosity.order);
            if (!foundCuriosity) {
              myCuriosities.push({
                order: allCuriosity.order,
                title: allCuriosity.title,
                description: ''
              });
            } else {
              myCuriosities.push({
                order: allCuriosity.order,
                title: allCuriosity.title,
                description: foundCuriosity.description
              });
            }

          });

          dialogConfig.data.value = myCuriosities;


          break;

        default:
          alert('Edit not implemented');
          return;
    }

    this.dialog.open(OnsowerDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe(newValue => {
        if (newValue !== null) {
          if (newValue !== dialogConfig.data.value) {
            this.onsowersService.saveOnsower(this.onSower.uid, {
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


  getIcon(item) {

    for (const socialLink of this.allSocialLinks) {
      if ( item.toLowerCase().indexOf(socialLink.name) !== -1 ) {
        return socialLink.icon;
      }
    }

    return 'help-circle-outline';

  }

  OnDiscord() {
    const discordLink = this.dataService.getDiscordLink();
    window.open(discordLink, "_blank");
  }

  ngOnDestroy() {
    this.sowerSubscription.unsubscribe();
  }

}

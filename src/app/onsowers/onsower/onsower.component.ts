import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
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
  maxLength?: number;
}

const MAX_AREAS = 4;
const MAX_LENGTH_NAME = 30;
const MAX_LENGTH_DESC = 50;

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
  isProfile = false;
  pendingInfo = false;
  canBack = false;
  socials = [];
  sowerSubscription: Subscription;
  userSubscription: Subscription;


  fields = {
    uid: {
      property: 'uid',
      label: 'uid',
      value: '',
      unfilled: true,
      type: 'readonly',
      defaultValue: '',
      maxLength: 0,
    },
    email: {
      property: 'email',
      label: 'email',
      value: '',
      unfilled: true,
      type: 'readonly',
      defaultValue: '',
      maxLength: 0,
    },
    photoUrl: {
      property: 'photoUrl',
      label: 'photoUrl',
      value: '',
      unfilled: false,
      type: 'img',
      defaultValue: '../../assets/img/unknown_person.png',
      maxLength: 0,
    },
    displayName: {
      property: 'displayName',
      label: 'Nombre',
      value: '',
      unfilled: true,
      type: 'text',
      defaultValue: '',
      maxLength: 0,
    },
    familyName: {
      property: 'familyName',
      label: 'Apellidos',
      value: '',
      unfilled: true,
      type: 'text',
      defaultValue: '',
      maxLength: 0,
    },
    isAdmin: {
      property: 'isAdmin',
      label: 'isAdmin',
      value: false,
      unfilled: true,
      type: 'readonly',
      defaultValue: '',
      maxLength: 0,
    },
    jobDescription: {
      property: 'jobDescription',
      label: 'Descripción del puesto de trabajo',
      value: '',
      unfilled: true,
      type: 'text',
      defaultValue: '',
      maxLength: MAX_LENGTH_NAME,
    },
    jobAdditionalDesc: {
      property: 'jobAdditionalDesc',
      label: 'Descripción adicional del puesto de trabajo',
      value: '',
      unfilled: true,
      type: 'text',
      defaultValue: '',
      maxLength: MAX_LENGTH_DESC,
    },
    areas: {
      property: 'areas',
      label: 'Areas de conocimiento',
      value: [],
      unfilled: true,
      type: 'badget',
      defaultValue: '',
      maxLength: MAX_AREAS,
    },
    web: {
      property: 'web',
      label: 'Sitio web',
      value: '',
      unfilled: true,
      type: 'link',
      defaultValue: '',
      maxLength: 0,
    },
    socials: {
      property: 'socialLinks',
      label: 'Redes sociales',
      value: '',
      unfilled: true,
      type: 'icons',
      defaultValue: '',
      maxLength: 0,
    },
    country: {
      property: 'country',
      label: 'País',
      value: '',
      unfilled: true,
      type: 'text',
      defaultValue: '',
      maxLength: 0,
    },
    city: {
      property: 'city',
      label: 'Ciudad',
      value: '',
      unfilled: true,
      type: 'text',
      defaultValue: '',
      maxLength: 0,
    },
    curiosities: {
      property: 'curiosities',
      label: 'Curiosidades',
      value: [],
      unfilled: true,
      type: 'list',
      defaultValue: '',
      maxLength: MAX_LENGTH_DESC,
    },
    info: {
      property: 'info',
      label: 'Un poco sobre mi y mis proyectos',
      value: '',
      unfilled: true,
      type: 'textarea',
      defaultValue: '',
      maxLength: 0,
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
    private router: Router,
  ) { }

  ngOnInit() {
    this.allAreas = this.dataService.getAreas();
    this.allCuriosities = this.dataService.getCuriosities();
    this.allSocialLinks = this.dataService.getSocialLinks();

    const uid = this.route.snapshot.paramMap.get('id');

    this.userSubscription = this.auth.getCurrentUser().subscribe( user => {
      if (user) {
        let onSowerId: string;

        this.user = user;

        // Check if profile menu option selected
        if (!uid) {
          this.isProfile = true;
        }

        if (this.isProfile) {
          if (user.pendingInfo) {
            this.pendingInfo = true;
            this.canEdit = false;
          }
          onSowerId = user.uid;
        } else {
          this.canBack = true;
          onSowerId = uid;
          if ( uid !== user.uid ) {
            if (!user.isAdmin) {
              this.canEdit = false;
            }
          }
        }

        if (!this.sowerSubscription) {
          this.sowerSubscription = this.onsowersService.fetchOnsower(onSowerId).subscribe( onSower => {
            this.onSower = onSower;
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

  onComplete() {
    this.router.navigateByUrl('/onsowers/init');
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

    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }

    if (this.sowerSubscription) {
      this.sowerSubscription.unsubscribe();
    }

  }

}

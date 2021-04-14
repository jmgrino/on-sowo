import { Partnership } from './../partnership.model';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/auth/user.model';
import { AuthService } from 'src/app/auth/auth.service';
import { AlertController, MenuController } from '@ionic/angular';
import { MatDialog } from '@angular/material/dialog';
import { UIService } from 'src/app/shared/ui.service';
import { StorageService } from 'src/app/shared/storage.service';
import { ShowdownConverter } from 'ngx-showdown';
import { ActivatedRoute, Router } from '@angular/router';
import { PartnershipsService } from '../partnerships.service';

@Component({
  selector: 'app-partnership',
  templateUrl: './partnership.component.html',
  styleUrls: ['./partnership.component.scss'],
})
export class PartnershipComponent implements OnInit {
  user: User;
  id: string;
  partnership: Partnership;
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
      label: 'Nombre del colaborador',
      value: '',
      unfilled: true,
      alwaysShowLabel: false,
      type: 'text',
      defaultValue: '',
    },
    photoUrl: {
      property: 'photoUrl',
      label: 'Foto del colaborador',
      value: '',
      unfilled: false,
      alwaysShowLabel: false,
      type: 'img',
      defaultValue: '../../assets/img/unknown.png',
    },
    description: {
      property: 'description',
      label: 'Description del descuento',
      value: '',
      unfilled: true,
      alwaysShowLabel: false,
      type: 'textarea',
      defaultValue: '',
    },
    type: {
      property: 'type',
      label: 'Tipo de colaborador',
      value: '',
      unfilled: true,
      alwaysShowLabel: false,
      type: 'text',
      defaultValue: '',
    },

  };

  constructor(
    private auth: AuthService,
    private sidemenu: MenuController,
    private dialog: MatDialog,
    private uiService: UIService,
    private partnershipsService: PartnershipsService,
    // private dataService: DataService,
    private storageService: StorageService,
    // private showdownConverter: ShowdownConverter,
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

        this.partnershipsService.fetchPartnership(this.id).subscribe( partnership => {
          this.partnership = partnership;

          for (const property in this.partnership) {
            if (this.fields[property] !== undefined) {
              this.fields[property].value = this.partnership[property];
              if (this.partnership[property].length > 0) {
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

  onDelete() {

  }

  onEditField(event) {}

}

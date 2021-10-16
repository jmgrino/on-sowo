import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { DataService } from '../shared/data.service';
import { EditDialogComponent } from '../shared/edit-dialog/edit-dialog.component';
import { UIService } from '../shared/ui.service';
import { Partnership } from './partnership.model';
import { PartnershipsService } from './partnerships.service';

const ALL_TYPES = "Todos";

@Component({
  selector: 'app-partnerships',
  templateUrl: './partnerships.page.html',
  styleUrls: ['./partnerships.page.scss'],
})
export class PartnershipsPage implements OnInit, OnDestroy {
  allTypes = ALL_TYPES;
  user: User;
  partnerships: Partnership[] = [];
  filteredPartnerships: Partnership[] = [];
  partnershipsTypes: string[] = [];
  selectedIndex: number = -1;
  partnershipsSubscription: Subscription;


  constructor(
    private auth: AuthService,
    private sidemenu: MenuController,
    // private fb: FormBuilder,
    // private dataService: DataService,
    private router: Router,
    private dialog: MatDialog,
    private uiService: UIService,
    private partnershipsService: PartnershipsService
  ) { }

  ngOnInit() {

    // this.partnershipsTypes = this.dataService.getPartnershipsTypes();

    this.auth.getCurrentUser().subscribe( user => {
      if (user) {
        this.user = user;

        this.partnershipsSubscription = this.partnershipsService.fetchPartnerships().subscribe( partnerships => {
          this.partnerships = partnerships;
          for (const partnership of partnerships) {
            if (partnership.types) {
              for (const type of partnership.types) {
                if (!this.partnershipsTypes.includes(type)) {
                  this.partnershipsTypes.push(type);
                }
              }
            }
          }
          this.onSearch(ALL_TYPES);
        });

      }
    });
  }


  ionViewWillEnter() {
    this.sidemenu.enable(true);
  }

  onAdd() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop = true;
    // dialogConfig.closeOnNavigation = false;

    dialogConfig.data = {
      property: 'name',
      label: 'Nombre del colaborador',
      value: '',
      unfilled: true,
      type: 'text',
      defaultValue: '',
    };

    dialogConfig.width = '400px';

    this.dialog.open(EditDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe(newValue => {
        // console.log('newValue', newValue);

        if (newValue !== null) {
          if (newValue !== dialogConfig.data.value) {
            this.partnershipsService.addPartnership({
              [dialogConfig.data.property]: newValue
            }).subscribe( ( result ) => {
              this.router.navigateByUrl(`/partnerships/${result.id}`);
            },
            error => {
              const message = this.uiService.translateFirestoreError(error);
              this.uiService.showStdSnackbar(message);
            });

          }
        }
      });

  }

  onType(type: string, index: number) {
    this.selectedIndex = index;
    this.onSearch(type)

  }

  onSearch(type: string) {

    if (type == ALL_TYPES) {
      this.filteredPartnerships = [...this.partnerships];
    } else {
      this.filteredPartnerships = this.partnerships.filter( partnership => {
        if (partnership.types) {
          return partnership.types.includes(type);
        } else {
          return false;
        }
      })
    }

  }

  // OnDiscord() {
  //   const discordLink = this.dataService.getDiscordLink();
  //   window.open(discordLink, "_blank");
  // }


  ngOnDestroy() {
    this.partnershipsSubscription.unsubscribe();
  }

}

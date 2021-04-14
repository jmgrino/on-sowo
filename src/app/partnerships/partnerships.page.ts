import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-partnerships',
  templateUrl: './partnerships.page.html',
  styleUrls: ['./partnerships.page.scss'],
})
export class PartnershipsPage implements OnInit {
  user: User;
  partnerships: Partnership[] = [];
  filteredPartnerships: Partnership[] = [];
  partnershipsTypes: string[];
  selectedIndex: number = -1;


  constructor(
    private auth: AuthService,
    private sidemenu: MenuController,
    private fb: FormBuilder,
    private dataService: DataService,
    private router: Router,
    private dialog: MatDialog,
    private uiService: UIService,
    private partnershipsService: PartnershipsService
  ) { }

  ngOnInit() {

    // for (let i=0; i<9; i++) {
    //   this.partnerships.push({
    //     id: 'test',
    //     type: 'Comida y take away',
    //     photoUrl: 'https://picsum.photos/id/1059/200/300',
    //     name: 'Descuento ' + (i+1),
    //     description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    //   });
    //   // this.courses[i].description = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.';
    // }

    this.partnershipsTypes = this.dataService.getPartnershipsTypes();

    this.auth.getCurrentUser().subscribe( user => {
      if (user) {
        this.user = user;
        this.onSearch();

        this.partnershipsService.fetchPartnerships().subscribe( partnerships => {
          this.partnerships = partnerships;
          this.onSearch();
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
    console.log(type, index);
    this.selectedIndex = index;

  }

  onSearch() {

    this.filteredPartnerships = [...this.partnerships];

  }

}

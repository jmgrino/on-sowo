import { OnsowersService } from './onsowers.service';
import { DataService } from './../shared/data.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-onsowers',
  templateUrl: './onsowers.page.html',
  styleUrls: ['./onsowers.page.scss'],
  // encapsulation: ViewEncapsulation.None,
})
export class OnsowersPage implements OnInit {
  user: User;
  onSowers: User[];
  filteredOnSowers: User[];
  areas: string[];
  osNumber: number;
  searchForm: FormGroup;
  locations: string[];
  searchFilter = '';

  constructor(
    private auth: AuthService,
    private sidemenu: MenuController,
    private dataService: DataService,
    private onsowersService: OnsowersService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.areas = this.dataService.getAreas();
    this.auth.getCurrentUser().subscribe( user => {
      if (user) {
        this.user = user;
        this.onsowersService.fetchOnsowers().subscribe( onSowers => {
          // this.onSowers = onSowers;

          // Test >>>
          const tmpSowers = onSowers;
          this.onSowers = [...tmpSowers];
          for (let i = 1; i <= 10; i++) {
            this.onSowers = [...this.onSowers, ...tmpSowers];
          }
          // <<< Test

          this.osNumber = this.onSowers.length;

          this.locations = [];
          for (const onSower of this.onSowers) {
            if (onSower.city) {
              if ( !this.locations.includes(onSower.city) ) {
                this.locations.push(onSower.city);
              }
            }
          }

          this.onSearch();


        });
      }

    });

    this.searchForm = this.fb.group({
      area: [''],
      location: [''],
    });
  }

  ionViewWillEnter() {
    this.sidemenu.enable(true);
  }

  onSearch() {
    let foundArea: boolean;
    let foundLocation: boolean;


    if ( this.searchForm.value.area === 'Todas las areas' ) {
      this.searchForm.value.area = '';
    }

    if ( this.searchForm.value.location === 'Todas las ciudades' ) {
      this.searchForm.value.location = '';
    }

    this.searchFilter = (this.searchForm.value.area + ' ' + this.searchForm.value.location).trim();

    if ( this.searchForm.value.area || this.searchForm.value.location ) {
      this.filteredOnSowers = this.onSowers.filter( onSower => {
        if (this.searchForm.value.area === '') {
          foundArea = true;
        } else {
          if (onSower.areas) {
            foundArea = onSower.areas.includes(this.searchForm.value.area);
          } else {
            foundArea = false;
          }
        }

        if (this.searchForm.value.location === '') {
          foundLocation = true;
        } else {
          if ( onSower.city ) {
            foundLocation = onSower.city.includes(this.searchForm.value.location);
          } else {
            foundLocation = false;
          }
        }

        return foundArea && foundLocation;

      });

    } else {
      this.filteredOnSowers = [...this.onSowers];

    }






    // if ( this.searchForm.value.area ) {
    //   areaFilteredOnSowers = this.onSowers.filter( onSower => {
    //     if ( onSower.areas.includes(this.searchForm.value.area) ) {
    //       return true
    //     } else {
    //       return false
    //     }
    //   })
    // }

    // if ( this.searchForm.value.location ) {
    //   if ( this.searchForm.value.area ) {
    //     this.filteredOnSowers = areaFilteredOnSowers.filter( onSower => {
    //       if ( onSower.city.includes(this.searchForm.value.location) ) {
    //         return true
    //       } else {
    //         return false
    //       }
    //     })
    //   } else {
    //     this.filteredOnSowers = this.onSowers.filter( onSower => {
    //       if ( onSower.city.includes(this.searchForm.value.location) ) {
    //         return true
    //       } else {
    //         return false
    //       }
    //     })
    //   }
    // }

  }


}

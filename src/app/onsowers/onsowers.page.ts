import { Subscription } from 'rxjs';
import { OnsowersService } from './onsowers.service';
import { DataService } from './../shared/data.service';
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
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
export class OnsowersPage implements OnInit, OnDestroy {
  user: User;
  onSowers: User[];
  filteredOnSowers: User[];
  areas: string[];
  osNumber: number;
  filteredNumber: number;
  searchForm: FormGroup;
  locations: string[];
  searchFilter = '';
  sowersSubscription: Subscription;

  constructor(
    private auth: AuthService,
    private sidemenu: MenuController,
    private dataService: DataService,
    private onsowersService: OnsowersService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.areas = this.dataService.getAreas().sort();

    this.auth.getCurrentUser().subscribe( user => {
      if (user) {
        this.user = user;
        this.sowersSubscription = this.onsowersService.fetchOnsowers().subscribe( onSowers => {
          this.onSowers = onSowers;

          this.onSowers.sort((a,b) => {
            if (a.pendingInfo) {
              if (b.pendingInfo) {
                return 0;
              } else {
                return 1;
              }
            } else {
              if (b.pendingInfo) {
                return -1;
              } else {
                return 0;
              }
            }
          })


          // Test >>>
          // const tmpSowers = onSowers;
          // this.onSowers = [...tmpSowers];
          // for (let i = 1; i <= 10; i++) {
          //   this.onSowers = [...this.onSowers, ...tmpSowers];
          // }
          // <<< Test


          this.locations = [];

          for (const onSower of this.onSowers) {
            if (onSower.onlyAdmin != true ) {
              if (onSower.city) {
                if ( !this.locations.includes(onSower.city) ) {
                  this.locations.push(onSower.city);
                }
              }
            }
          }

          this.locations = this.locations.sort();

          this.onSearch();

          this.osNumber = this.filteredNumber;

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
    let preFilteredOnSowers: User[];


    if ( this.searchForm.value.area === 'Todas las areas' ) {
      this.searchForm.value.area = '';
    }

    if ( this.searchForm.value.location === 'Todas las ciudades' ) {
      this.searchForm.value.location = '';
    }

    this.searchFilter = (this.searchForm.value.area + ' ' + this.searchForm.value.location).trim();

    if ( this.searchForm.value.area || this.searchForm.value.location ) {
      preFilteredOnSowers = this.onSowers.filter( onSower => {
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
      preFilteredOnSowers = [...this.onSowers];

    }

    this.filteredOnSowers = preFilteredOnSowers.filter( onSower => {
      return !onSower.onlyAdmin;
    })

    this.filteredNumber = this.filteredOnSowers.length;

  }

  OnDiscord() {
    const discordLink = this.dataService.getDiscordLink();
    window.open(discordLink, "_blank");
  }



  ngOnDestroy() {
    this.sowersSubscription.unsubscribe();
  }

}

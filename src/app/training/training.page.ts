import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { DataService } from '../shared/data.service';
import { Course } from './course.model';

@Component({
  selector: 'app-training',
  templateUrl: './training.page.html',
  styleUrls: ['./training.page.scss'],
})
export class TrainingPage implements OnInit {
  user: User;
  searchForm: FormGroup;
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  trainingTypes: string[];
  areas: string[];

  constructor(
    private auth: AuthService,
    private sidemenu: MenuController,
    private fb: FormBuilder,
    private dataService: DataService,
  ) { }

  ngOnInit() {


    for (let i=0; i<9; i++) {
      this.courses.push({
        name: 'Curso de prueba ' + (i+1),
        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        areas: ['Comunicación','Webinar'],
        trainingType: 'Video',
      });
      // this.courses[i].description = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.';
    }



    this.areas = this.dataService.getTrainingAreas();
    this.trainingTypes = this.dataService.getTrainingTypes();

    this.auth.getCurrentUser().subscribe( user => {
      if (user) {
        this.user = user;

        this.onSearch();

      }

    });

    this.searchForm = this.fb.group({
      area: [''],
      trainingType: [''],
    });
  }

  ionViewWillEnter() {
    this.sidemenu.enable(true);
  }

  onSearch() {
    let foundArea: boolean;
    let foundLocation: boolean;
    this.filteredCourses = [...this.courses];


    // if ( this.searchForm.value.area == 'Todas las areas' ) {
    //   this.searchForm.value.area = '';
    // }

    // if ( this.searchForm.value.location == 'Todas las ciudades' ) {
    //   this.searchForm.value.location = '';
    // }

    // if ( this.searchForm.value.area || this.searchForm.value.location ) {
    //   this.filteredTraining = this.training.filter( training => {
    //     if (this.searchForm.value.area == '') {
    //       foundArea = true;
    //     } else {
    //       if (training.areas) {
    //         foundArea = training.areas.includes(this.searchForm.value.area);
    //       } else {
    //         foundArea = false;
    //       }
    //     }

    //     if (this.searchForm.value.location == '') {
    //       foundLocation = true;
    //     } else {
    //       if ( training.city ) {
    //         foundLocation = training.city.includes(this.searchForm.value.location);
    //       } else {
    //         foundLocation = false;
    //       }
    //     }

    //     return foundArea && foundLocation;

    //   });

    // } else {
    //   this.filteredTraining = [...this.training];

    // }




  }

  onPremium() {
    alert('Quiero ser Premium');
  }


}

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ShowdownConverter } from 'ngx-showdown';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { DataService } from 'src/app/shared/data.service';
import { UIService } from 'src/app/shared/ui.service';
import { Course } from '../course.model';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
})
export class CourseComponent implements OnInit {
  user: User;
  course: Course;
  editing = false;
  canEdit = false;

  fields = {
    id: {
      property: 'uid',
      label: 'uid',
      value: '',
      unfilled: true,
      type: 'readonly',
      defaultValue: '',
    },


  };

  trainingAreas: string[];
  trainingTypes: string[];


  constructor(
    private auth: AuthService,
    private sidemenu: MenuController,
    private dialog: MatDialog,
    private uiService: UIService,
    // private onsowersService: OnsowersService,
    private dataService: DataService,
    private showdownConverter: ShowdownConverter,
    private route: ActivatedRoute,

  ) { }

  ngOnInit() {
    this.trainingAreas = this.dataService.getTrainingAreas();
    this.trainingTypes = this.dataService.getTrainingTypes();

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {

      // Fetch course

    } else {
      console.log('Add');

      this.course = {
        name: '',
        id: '',
        photoUrl: '',
        description: '',
        areas: [],
        trainingType: '',
        author: '',
        duration: '',
      }
    }

    this.auth.getCurrentUser().subscribe( user => {
      if (user) {
        this.user = user;
        if (user.isAdmin) {
          this.canEdit = true;
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


}

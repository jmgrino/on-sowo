import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Subscription, Observable, from, of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { Course } from 'src/app/courses/course.model';
import { CoursesService } from 'src/app/courses/courses.service';
import { DataService } from '../data.service';
import { UIService } from '../ui.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit, OnDestroy {
  user: User;
  id: string;
  course: Course;
  editing = false;
  canEdit = false;
  courseSubscription: Subscription;
  safeURL: SafeResourceUrl;
  URL$: Observable<SafeResourceUrl>;

  constructor(
    private auth: AuthService,
    private sidemenu: MenuController,
    // private dialog: MatDialog,
    private uiService: UIService,
    private coursesService: CoursesService,
    private dataService: DataService,
    // private storageService: StorageService,
    // private showdownConverter: ShowdownConverter,
    private route: ActivatedRoute,
    // private alertController: AlertController,
    private router: Router,
    private sanitizer: DomSanitizer,
    private location: Location,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.auth.getCurrentUser().subscribe( user => {
      if (user) {
        this.user = user;
        if (user.isAdmin) {
          this.canEdit = true;
        }
        this.courseSubscription = this.coursesService.fetchCourse(this.id).subscribe( course => {
          if (course) {
            this.course = course;

            const url = this.course.videoUrl;
            let results = url.match('[\\?&]v=([^&#]*)');
            if (!results) {
              results = url.match('/([^&#/]*$)');
            }

            const video   = (results === null) ? url : results[1];
            const options = "?rel=0&showinfo=0&controls=1&modestbranding=1&autoplay=1"

            const urlSanitized = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video + options);

            this.URL$ = of(urlSanitized);


          } else {
            this.router.navigateByUrl('/courses');

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

  goBack() {
    // this.router.navigateByUrl(`/courses/${this.course.id}`);
    this.location.back()
  }

  OnDiscord() {
    const discordLink = this.dataService.getDiscordLink();
    window.open(discordLink, "_blank");
  }


  ngOnDestroy() {
    this.courseSubscription.unsubscribe();
  }


}

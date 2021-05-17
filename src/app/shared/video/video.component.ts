import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('iframe', {static: false}) iframe: ElementRef
  // @ViewChild('divClick') divClick: ElementRef;
  user: User;
  id: string;
  course: Course;
  editing = false;
  canEdit = false;
  courseSubscription: Subscription;
  safeURL: SafeResourceUrl;
  URL$: Observable<SafeResourceUrl>;
  videoWidth: string;
  videoHeight: string;
  screenWidth: number;
  screenHeight: number;
  allowFullScreen: string;
  // wrapperStyle = "left: 100px;"
  // wrapperStyle = ""

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


      // var eventCount = 0;
      // var eventProperty = [];

      // var TrackMouse = function (mouseEvent) {
      //     eventProperty[eventCount++] = {
      //         id: mouseEvent.toElement.id,
      //         type: 'mouse',
      //         ts: Date.now(),
      //         x: mouseEvent.x,
      //         y: mouseEvent.y
      //     };

      //     console.log("Element id: " + eventProperty[eventCount - 1].id + ", X: " + mouseEvent.x + ", Y: " + mouseEvent.y + "\n");
      // };

      // document.addEventListener('click', TrackMouse, true);


      if (user) {
        this.user = user;
        if (user.isAdmin) {
          this.canEdit = true;
        }
        this.courseSubscription = this.coursesService.fetchCourse(this.id).subscribe( course => {
          if (course) {
            this.course = course;



            this.resizeVideo();

            const url = this.course.videoUrl;
            let results = url.match('[\\?&]v=([^&#]*)');
            if (!results) {
              results = url.match('/([^&#/]*$)');
            }

            const video   = (results === null) ? url : results[1];
            // const options = "rel=0&showinfo=0&controls=1&modestbranding=1&autoplay=1"
            const optionsObj = {
              autoplay: '1',
              controls: '2',
              fs: this.allowFullScreen,
              modestbranding: '1',
              rel: '0',
              start: '1',
            }
            const options = this.getOptions(optionsObj)

            const urlSanitized = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video + '?' + options);

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

  @HostListener('window:resize', ['$event'])
  onResize(event) {

    this.resizeVideo();

  }

  private getOptions(object) {
    let options = '';
    for (var property in object) {
      if (object.hasOwnProperty(property)) {
        if ( options.length > 0 ) {
          options += '&';
        }
        options += property + '=' + object[property];
      }
    }
    return options;
  }

  private resizeVideo() {
    let windowWidth;
    let windowHeight;

    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    // console.log('Screen', this.screenWidth, this.screenHeight);

    // const videoRatio = 16/9;

    if (this.screenWidth < 990) {
      windowWidth = this.screenWidth;
      windowHeight = this.screenHeight - 56;
    } else {
      windowWidth = this.screenWidth - 300;
      windowHeight = this.screenHeight - 168;
    }

    // let windowRatio = windowWidth / windowHeight;

    // if ( windowRatio > videoRatio ) {
    //   console.log('wR > vR');


    // } else {

    // }

    if (this.screenWidth < 576) {
      this.allowFullScreen = '1';
    } else {
      this.allowFullScreen = '0';
    }


    this.videoWidth = windowWidth.toString() + 'px';
    this.videoHeight = windowHeight.toString() + 'px';

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

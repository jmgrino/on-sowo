import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides, MenuController } from '@ionic/angular';
import { ShowdownConverter } from 'ngx-showdown';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Curiosity, User } from 'src/app/auth/user.model';
import { DataService } from 'src/app/shared/data.service';
import { MyErrorStateMatcher, UIService } from 'src/app/shared/ui.service';
import { OnsowersService } from '../onsowers.service';

const MAX_AREAS = 4;
const MAX_LENGTH_NAME = 30;
const MAX_LENGTH_DESC = 50;

@Component({
  selector: 'app-onsower-init',
  templateUrl: './onsower-init.component.html',
  styleUrls: ['./onsower-init.component.scss'],
})
export class OnsowerInitComponent implements OnInit, OnDestroy {
  @ViewChild('signupSlider', { static: true }) signupSlider: IonSlides;
  @ViewChild('inputName', { static: true }) inputName;
  signupForm1: FormGroup;
  signupForm2: FormGroup;
  signupForm3: FormGroup;
  signupForm4: FormGroup;
  isLoading = false;
  private loadingSubs: Subscription;
  user: User;
  onSower: User;
  isSubmitted = false;

  allAreas: string[];
  areas: string[];
  // checkAreas: {
  //   name: string,
  //   checked: boolean
  // }[];
  checkAreas = [];
  allCuriosities: Curiosity[];

  defaultValue = '../../../assets/img/unknown_person.png';
  // defaultValue = 'https://picsum.photos/id/1025/200/250';
  photoUrl: string;
  photoFile: File;
  fileName: string;

  sowerSubscription: Subscription;
  userSubscription: Subscription;

  matcher = new MyErrorStateMatcher();

  maxLengthName: number = MAX_LENGTH_NAME;
  maxLengthDesc: number = MAX_LENGTH_DESC;




  constructor(
    private auth: AuthService,
    private sidemenu: MenuController,
    // private dialog: MatDialog,
    private uiService: UIService,
    private onsowersService: OnsowersService,
    private dataService: DataService,
    // private showdownConverter: ShowdownConverter,
    private fb: FormBuilder,
    // private route: ActivatedRoute,
    private router: Router,

  ) { }

  ngOnInit() {

    // const uid = this.route.snapshot.paramMap.get('id');
    this.sidemenu.enable(false);

    this.loadingSubs = this.uiService.loadingStateChanged.subscribe( isLoading => {
      this.isLoading = isLoading;
    });

    this.signupSlider.update();
    this.signupSlider.lockSwipes( true );

    const urlVal = '^(http[s]?://){0,1}(www.){0,1}[a-zA-Z0-9.-]+.[a-zA-Z]{2,5}[.]{0,1}';

    this.signupForm1 = this.fb.group({
      firstName: ['', [Validators.required]],
      familyName: ['', [Validators.required]],
      jobDescription: ['', [Validators.required, Validators.maxLength(MAX_LENGTH_NAME)]],
      jobAdditionalDesc: ['', [Validators.required, Validators.maxLength(MAX_LENGTH_DESC)]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      instagram: ['', [Validators.pattern(urlVal)]],
      linkedin: ['', [Validators.pattern(urlVal)]],
      web: ['', [Validators.pattern(urlVal)]],
      areas:  this.fb.array([]),
      curiosities: this.fb.array([],[Validators.required]),
      info: ['', [Validators.required]],
    });


    // this.fillAreasArray();
    // this.fillCuriositiesArray();




    this.userSubscription = this.auth.getCurrentUser().subscribe( user => {
      if (user) {
        this.user = user;
        if (!user.pendingInfo) {
          this.router.navigateByUrl('/profile');
        }
        console.log(user);
        let onSowerId: string;
        onSowerId = user.uid;

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

            // this.socials = [];

            // for (const property in this.onSower.socialLinks) {
            //   const url = this.onSower.socialLinks[property];
            //   const icon = this.getIcon(url);
            //   this.socials.push({
            //     name: property,
            //     url,
            //     icon,
            //   });
            // }


            this.signupForm1.patchValue({
              firstName: this.onSower.displayName,
              familyName: this.onSower.familyName
            });


          }, error => {
            const message = this.uiService.translateFirestoreError(error);
            this.uiService.showStdSnackbar(message);
          });

        }













      }

    });

  }

  ionViewWillEnter() {
    this.sidemenu.enable(false);
    this.isSubmitted = false;
  }

  ngOnDestroy() {
    if (this.loadingSubs) {
      this.loadingSubs.unsubscribe();
    }
  }

  selectPhoto(event) {
    const file: File = event.target.files[0];

    if (!file.name) {
      return;
    }

    this.photoFile = file;

    const fileExt = file.name.split('.').pop();
    this.fileName = 'avatar.' + fileExt;
    // const filePath = `courses/${this.data.id}/${fileName}`;

    let fileOK = false;

    if (file.type.split('/')[0] !== 'image') {
      this.uiService.showStdSnackbar('Solo imagenes');
    } else if (file.size >= (2 * 1024 * 1024) ) {
      this.uiService.showStdSnackbar('Imagen demasiado grande. Debe ser menor de 2 MBytes');
    } else  {
      fileOK = true;
    }

    if (fileOK) {
      if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();

        reader.onload = (event:any) => {
         this.photoUrl = event.target.result;
        }

        reader.readAsDataURL(event.target.files[0]);
      }

    }

  }



}

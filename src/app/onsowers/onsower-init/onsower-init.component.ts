import { Component, OnInit, ViewChild, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
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
  @ViewChildren(MatCheckbox) areasCheckbox: QueryList<MatCheckbox>;
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

    this.allAreas = this.dataService.getAreas();
    this.allAreas.forEach( area => {
      if (area) {
        this.checkAreas.push({
          name: area,
          // checked: true,
          checked: false,
        });
      }
    })
    this.allCuriosities = this.dataService.getCuriosities();

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
    });

    this.signupForm2 = this.fb.group({
      areas:  this.fb.array([]),
    });

    this.signupForm3 = this.fb.group({
      curiosities: this.fb.array([],[Validators.required]),
    });

    this.signupForm4 = this.fb.group({
      info: ['', [Validators.required]],
    });


    this.fillAreasArray();
    this.fillCuriositiesArray();


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


  onCancel() {
    this.router.navigateByUrl('/profile');
  }


  goToPrev() {
    this.signupSlider.lockSwipes( false );
    this.signupSlider.slidePrev();
    this.signupSlider.lockSwipes( true );
  }

  goToNext() {
    this.signupSlider.lockSwipes( false );
    this.signupSlider.slideNext();
    this.signupSlider.lockSwipes( true );
  }



  fillAreasArray() {
    const areas: FormArray = this.signupForm2.get('areas') as FormArray;

    for (const area of this.checkAreas) {
      if (area) {
        areas.push(new FormControl(area.checked));
      }
    }

  }

  get curiosities() {
    return this.signupForm3.get('curiosities') as FormArray;
  }

  fillCuriositiesArray() {

    for (const curiosity of this.allCuriosities) {
      this.curiosities.push(this.fb.group({
        title: [curiosity.title],
        description: ['', [Validators.required, Validators.maxLength(MAX_LENGTH_DESC)]],
      }));
    }

  }



  onChange(e, i) {

    if (this.signupForm2.value.areas.filter( (area, index) => {
      if (index === i) {
        return e.checked;
      } else {
        return area;
      }
    }).length > MAX_AREAS) {
      const message = 'Puedes elegir ' + MAX_AREAS + ' areas como máximo';
      this.uiService.showStdSnackbar(message);
      this.areasCheckbox.forEach((directive, index) => {
        if (index === i) {
          directive.checked = false;
        }
      });
    } else {
      this.signupForm2.value.areas[i] = e.checked;
    }

  }




}

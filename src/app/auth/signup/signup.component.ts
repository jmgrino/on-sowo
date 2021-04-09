import { Curiosity } from './../user.model';
import { DataService } from 'src/app/shared/data.service';
import { Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';
import { User, SocialLink } from '../user.model';
import { MatCheckbox } from '@angular/material/checkbox';

const MAX_AREAS = 6;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
  @ViewChild('inputEmail') inputEmail;
  @ViewChildren(MatCheckbox) areasCheckbox: QueryList<MatCheckbox>;

  signupForm: FormGroup;
  isLoading = false;
  private loadingSubs: Subscription;
  user$: Observable<User>;
  hide = true;
  // passwordType = 'password';
  // passwordIcon = 'eye-off';
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


  constructor(
    private auth: AuthService,
    private uiService: UIService,
    private fb: FormBuilder,
    private sidemenu: MenuController,
    private dataService: DataService,
    ) {}

  ngOnInit() {
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

    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
    const urlVal = '^(http[s]?://){0,1}(www.){0,1}[a-zA-Z0-9.-]+.[a-zA-Z]{2,5}[.]{0,1}'
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('^[\x20-\x7E]{6,}$')]],
      firstName: ['', [Validators.required]],
      familyName: ['', [Validators.required]],
      jobDescription: ['', [Validators.required]],
      jobAdditionalDesc: ['', [Validators.required]],
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
    this.fillAreasArray();
    this.fillCuriositiesArray();
    this.user$ = this.auth.getCurrentUser();

  }

  ionViewWillEnter() {
    this.sidemenu.enable(false);
    this.isSubmitted = false;

  }

  ionViewDidEnter() {

    setTimeout(() => {
      if (this.inputEmail) {
        this.inputEmail.nativeElement.focus();
      }
    }, 100);

  }


  onSignup() {
    this.isSubmitted = true;


    let areas = [];

    for (let i = 0; i < this.signupForm.value.areas.length; i++) {
      if (this.signupForm.value.areas[i]) {
        areas.push(this.checkAreas[i].name);
      }
    }

    const curiositiesResult = [];
    for (let i = 0; i < this.signupForm.value.curiosities.length; i++) {
      if (this.signupForm.value.curiosities[i].description.trim().length > 0) {
        curiositiesResult.push({
          order: i,
          title: this.signupForm.value.curiosities[i].title,
          description: this.signupForm.value.curiosities[i].description,
        });
      }
    }

    if (this.signupForm.valid) {
    // if (true) {
      const socialLinks: SocialLink = {};
      if (this.signupForm.value.instagram.trim().length > 0) {
        socialLinks.instagram = this.signupForm.value.instagram.replace(/(^\w+:|^)\/\//, '');
      }
      if (this.signupForm.value.linkedin.trim().length > 0) {
        socialLinks.linkedin = this.signupForm.value.linkedin.replace(/(^\w+:|^)\/\//, '');
      }
      const fsUserData = {
        displayName: this.signupForm.value.firstName,
        familyName: this.signupForm.value.familyName,
        jobDescription: this.signupForm.value.jobDescription,
        jobAdditionalDesc: this.signupForm.value.jobAdditionalDesc,
        city: this.signupForm.value.city,
        state: this.signupForm.value.state,
        country: this.signupForm.value.country,
        socialLinks: socialLinks,
        web: this.signupForm.value.web.replace(/(^\w+:|^)\/\//, ''),
        areas: areas,
        curiosities: curiositiesResult,
        info: this.signupForm.value.info,
        isAdmin: false,
        isActive: true,
        isPremium: false,
      }

      this.auth.registerUser(this.signupForm.value.email, this.signupForm.value.password, fsUserData, this.photoFile, this.fileName);
    } else {
      const message = 'Hay errores en el formulario';
      this.uiService.showStdSnackbar(message);
    }
  }


  ngOnDestroy() {
    if (this.loadingSubs) {
      this.loadingSubs.unsubscribe();
    }
  }

  fillAreasArray() {
    const areas: FormArray = this.signupForm.get('areas') as FormArray;

    for (const area of this.checkAreas) {
      if (area) {
        areas.push(new FormControl(area.checked));
      }
    }

  }

  get curiosities() {
    return this.signupForm.get('curiosities') as FormArray;
  }

  fillCuriositiesArray() {

    for (const curiosity of this.allCuriosities) {
      this.curiosities.push(this.fb.group({
        title: [curiosity.title],
        description: ['', [Validators.required]],
      }));
    }

  }

  onChange(e, i) {

    if (this.signupForm.value.areas.filter( (area, index) => {
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
      this.signupForm.value.areas[i] = e.checked;
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


  // hideShowPassword() {
  //   this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
  //   this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  // }

}

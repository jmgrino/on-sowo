import { DataService } from 'src/app/shared/data.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuController } from '@ionic/angular';
import { ppid } from 'process';
import { Observable, Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';
import { User, SocialLink } from '../user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
  @ViewChild('inputEmail') inputEmail;
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
  defaultValue = '../../../assets/img/unknown_person.png';


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
          checked: false,
        });
      }
    })

    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
    const urlVal = '^(http[s]?://){0,1}(www.){0,1}[a-zA-Z0-9.-]+.[a-zA-Z]{2,5}[.]{0,1}'
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('^[\x20-\x7E]{6,}$')]],
      firstName: ['', [Validators.required]],
      familyName: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      instagram: ['', [Validators.pattern(urlVal)]],
      linkedin: ['', [Validators.pattern(urlVal)]],
      web: ['', [Validators.pattern(urlVal)]],
      areas:  this.fb.array([]),
    });
    this.fillArray();
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

    if (this.signupForm.valid) {
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
        isAdmin: false,
        isActive: true,
        isPremium: false,
        city: this.signupForm.value.city,
        state: this.signupForm.value.state,
        country: this.signupForm.value.country,
        socialLinks: socialLinks,
        web: this.signupForm.value.web.replace(/(^\w+:|^)\/\//, ''),
        areas: areas,
      }
      console.log(fsUserData);

      // this.auth.registerUser(this.signupForm.value.email, this.signupForm.value.password, fsUserData);
    } else {
      const message = 'Hay errores en el formulario';
      this.uiService.showStdSnackbar(message);
    }
  }

  // onAddArea(event) {
  //   console.log(event);
  //   console.log(event.detail.value);

  //   if (this.areas) {
  //     if (!this.areas.includes(event.detail.value)) {
  //       this.areas.push(event.detail.value);
  //     }
  //   } else {
  //     this.areas = [event.detail.value]
  //   }

  //  }

  //  onRemoveArea(badge) {
  //    console.log(badge);
  //    const index = this.areas.indexOf(badge);
  //    if (index > -1) {
  //      this.areas.splice(index, 1);
  //    }

  //  }

  ngOnDestroy() {
    if (this.loadingSubs) {
      this.loadingSubs.unsubscribe();
    }
  }

  fillArray() {
    const areas: FormArray = this.signupForm.get('areas') as FormArray;

    for (const area of this.checkAreas) {
      if (area) {
        areas.push(new FormControl(area.checked));
      }
    }
  }

  onChange(e, i) {
    this.signupForm.value.areas[i] = e.checked;
  }


  // hideShowPassword() {
  //   this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
  //   this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  // }

}

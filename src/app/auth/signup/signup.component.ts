import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonSlides, MenuController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';
import { User } from '../user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
  @ViewChild('inputEmail') inputEmail;
  @ViewChild('signupSlider', { static: true }) signupSlider: IonSlides;
  @ViewChild('inputName', { static: true }) inputName;
  signupForm1: FormGroup;
  signupForm2: FormGroup;
  isLoading = false;
  private loadingSubs: Subscription;
  user$: Observable<User>;
  hide = true;
  passwordType = 'password';
  passwordIcon = 'eye';
  isSubmitted = false;

  constructor(
    private auth: AuthService,
    private uiService: UIService,
    private fb: FormBuilder,
    private sidemenu: MenuController,
    private router: Router,
    ) {}

  ngOnInit() {
    this.signupSlider.update();
    this.signupSlider.lockSwipes( true );

    this.loadingSubs = this.uiService.loadingStateChanged.subscribe( isLoading => {
      this.isLoading = isLoading;
    });

    this.signupForm1 = this.fb.group({
      firstName: ['', [Validators.required]],
      familyName: ['', [Validators.required]],
    });

    this.signupForm2 = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('^[\x20-\x7E]{6,}$')]],
      confirmPassword: [''],
    }, {
      validator: this.mustMatch('password', 'confirmPassword')
    });


    this.user$ = this.auth.getCurrentUser();

  }

  ionViewWillEnter() {
    this.sidemenu.enable(false);
    this.isSubmitted = false;

  }

  ionViewDidEnter() {

    setTimeout(() => {
      if (this.inputName) {
        this.inputName.setFocus();
      }
    }, 100);

  }

  onSignup() {
    this.isSubmitted = true;

    if (!this.signupForm1.valid) {
      this.signupSlider.lockSwipes( false );
      this.signupSlider.slideTo(0);
      this.signupSlider.lockSwipes( true );
      const message = 'Hay errores en el formulario';
      this.uiService.showStdSnackbar(message);
    } else if (!this.signupForm2.valid) {
      this.signupSlider.lockSwipes( false );
      this.signupSlider.slideTo(1);
      this.signupSlider.lockSwipes( true );
      const message = 'Hay errores en el formulario';
      this.uiService.showStdSnackbar(message);
    } else {
      const fsUserData = {
        displayName: this.signupForm1.value.firstName,
        familyName: this.signupForm1.value.familyName,
        pendingInfo: true
      };

      this.auth.getCurrentUser();

      this.auth.registerUser(this.signupForm2.value.email, this.signupForm2.value.password, fsUserData);

      // this.router.navigateByUrl('/onsowers/welcome');


      // const message = 'Simulación de registro de usuario (Guard desactivado)';
      // this.uiService.showStdSnackbar(message);
      // setTimeout( () => {
      //   this.uiService.loadingStateChanged.next(false);
      //   this.router.navigateByUrl('/onsowers/welcome');
      // }, 2000)

    }

  }


  goToNext() {
    this.signupSlider.lockSwipes( false );
    this.signupSlider.slideNext();
    this.signupSlider.lockSwipes( true );

  }

 goToPrev() {
    this.signupSlider.lockSwipes( false );
    this.signupSlider.slidePrev();
    this.signupSlider.lockSwipes( true );
 }

 onCancel() {
  this.router.navigateByUrl('/auth/login');
 }


  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
    this.signupForm2.updateValueAndValidity();
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (this.passwordType == "text") {
        matchingControl.setErrors(null);
      } else if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }

    }
  }

  ngOnDestroy() {
    if (this.loadingSubs) {
      this.loadingSubs.unsubscribe();
    }
  }

}

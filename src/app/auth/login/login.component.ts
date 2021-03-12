import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';
import { User } from '../user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('inputEmail') inputEmail;
  loginForm: FormGroup;
  isLoading = false;
  private loadingSubs: Subscription;
  user$: Observable<User>;
  hide = true;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  isSubmitted = false;

  constructor(
    private auth: AuthService,
    private uiService: UIService,
    private fb: FormBuilder,
    private sidemenu: MenuController,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('^[\x20-\x7E]{6,}$')]],
    });
    this.user$ = this.auth.getCurrentUser();

    // this.getFormValidationErrors();

  }

  ionViewWillEnter() {
    this.sidemenu.enable(false);
    this.isSubmitted = false;

  }

  ionViewDidEnter() {

    setTimeout(() => {
      if (this.inputEmail) {
        this.inputEmail.setFocus();
      }
    }, 100);

  }

  onLogin() {
    this.isSubmitted = true;

    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.value.email, this.loginForm.value.password);
    }

  }

  onLogout() {
    this.auth.logout().subscribe();
  }

  ionViewWillLeave() {
    this.uiService.loadingStateChanged.next(false);
    // this.sidemenu.enable(true);
  }

  ngOnDestroy() {
    if (this.loadingSubs) {
      this.loadingSubs.unsubscribe();
    }
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  onResetPassword() {
    this.router.navigateByUrl('/auth/reset-password');
  }

  // getFormValidationErrors() {
  //   Object.keys(this.loginForm.controls).forEach(key => {

  //   const controlErrors: ValidationErrors = this.loginForm.get(key).errors;
  //   if (controlErrors != null) {
  //         Object.keys(controlErrors).forEach(keyError => {
  //
  //         });
  //       }
  //     });
  //   }

}

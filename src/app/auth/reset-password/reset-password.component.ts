import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  @ViewChild('inputEmail') inputEmail;
  email: string;
  PasswordResetForm: FormGroup;
  isSubmitted = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder,
    // private sidemenu: MenuController
    ) {
      // this.sidemenu.enable(false);
    }

  ngOnInit() {
    this.PasswordResetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ionViewDidEnter() {

    setTimeout(() => {
      if (this.inputEmail) {
        this.inputEmail.setFocus();
      }
    }, 100);

    this.isSubmitted = false;

    // this.sidemenu.enable(false);

  }

  onChangePassword() {
    this.isSubmitted = true;
    if (this.PasswordResetForm.valid) {
      this.auth.resetPassword(this.PasswordResetForm.value.email)
      .then(() => this.router.navigate(['/auth/login']));
    }
  }

  onClose() {
    this.router.navigateByUrl('/auth/login');
  }

}

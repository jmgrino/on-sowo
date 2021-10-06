import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { AuthPageRoutingModule } from './auth-routing.module';

import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignupComponent } from './signup/signup.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TemplatesModule } from './../templates/templates.module';
import { UsersComponent } from './users/users.component';


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AuthPageRoutingModule,
    SharedModule,
    TemplatesModule,
  ],
  declarations: [LoginComponent, ResetPasswordComponent, SignupComponent, UsersComponent, PrivacyPolicyComponent]
})
export class AuthPageModule {}

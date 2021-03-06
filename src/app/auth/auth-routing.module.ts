import { UsersComponent } from './users/users.component';
import { SharedGuard } from './../shared/shared.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignupComponent } from './signup/signup.component';
import { AuthGuard } from './auth.guard';



const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: 'signup',
    component: SignupComponent,
    // canActivate: [AuthGuard],
    // data: {
    //   admin: true
    // }
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard],
    data: {
      admin: true
    }
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthPageRoutingModule {}

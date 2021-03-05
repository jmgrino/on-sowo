import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './blank/blank.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'blank',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthPageModule)
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule),
  },
  {
    path: 'blank',
    component: BlankComponent,
  },
  {
    path: 'onsowers',
    loadChildren: () => import('./onsowers/onsowers.module').then( m => m.OnsowersPageModule)
  },
  {
    path: 'mastermind',
    loadChildren: () => import('./mastermind/mastermind.module').then( m => m.MastermindPageModule)
  },
  {
    path: 'training',
    loadChildren: () => import('./training/training.module').then( m => m.TrainingPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

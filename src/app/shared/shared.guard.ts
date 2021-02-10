import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { merge, Observable, timer } from 'rxjs';
import { filter, map, mapTo, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SharedGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      const timeout$ = timer(2000).pipe(
        mapTo(null)
      );
  
      const getNotNullUser$ = this.auth.getCurrentUser().pipe(
        filter(result => result !== null),
      );
  
      return merge(getNotNullUser$, timeout$).pipe(
        take(1),
        map( user => {
          if (!user) {
            this.router.navigateByUrl('/auth/login');
            console.log('Auth False');
            
            return false;
          } else {
            return true;
          }
        })
      )

  }
  
  
}

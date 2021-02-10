import { User } from './user.model';
import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { UIService } from '../shared/ui.service';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$ = new BehaviorSubject<User>(null);

  printName = '';
  userEmail = '';

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private uiService: UIService,
    private ngZone: NgZone,
  ) {}

  initAuthListener() {
    this.afAuth.authState.subscribe( afUser => {
      if (afUser) {
        if (afUser.emailVerified === true) {
          this.setupUser(afUser).subscribe( user => {
            this.user$.next(user);
          });
        } else {
          this.user$.next(null);
        }
      } else {
        this.user$.next(null);
      }
    });
  }

  registerUser(email: string, password: string) {

    if ( !this.printName ) {
      const message = 'Please, logout and login again'
      this.uiService.showStdSnackbar(message);
      this.router.navigateByUrl('/auth/login');
      return;
    }

    this.uiService.loadingStateChanged.next(true);

    this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then(result => {
        this.uiService.loadingStateChanged.next(false);
        const message = 'Usuario creado';
        this.uiService.showStdSnackbar(message);
        this.afAuth.signOut().then(  () => {
          this.afAuth.signInWithEmailAndPassword(this.userEmail, this.getPrintName(this.printName)).then( user => {
            this.router.navigateByUrl('/auth/signup');
          })

        })

      })
      .catch(error => {
        this.uiService.loadingStateChanged.next(false);
        const message = this.uiService.translateAuthError(error);
        this.uiService.showStdSnackbar(message);
      });
  }

  login(email: string, password: string) {
    const loggedIn = false;
    this.printName = this.setPrintName(password);
    this.userEmail = email;

    this.uiService.loadingStateChanged.next(true);
    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then( result => {
        if (result.user.emailVerified !== true) {
          result.user.sendEmailVerification();
          this.uiService.showStdSnackbar('Por favor, valide su dirección de correo. Revise su bandeja de entrada');
        } else {
          const userRef: AngularFirestoreDocument<User> = this.afs.doc(
            `users/${result.user.uid}`
            );
            userRef.get().subscribe( data => {
              if (!data.exists) {
                userRef.set({
                  uid: result.user.uid,
                  email: result.user.email,
                  isAdmin: false,
                });
              }

              const afUser = result.user;
              this.setupUser(afUser).subscribe( user => {
                this.user$.next(user);
                this.ngZone.run(() => {
                  this.router.navigate(['/profile']);
                });
              });
          });
        }
      })
      .catch( error => {
        this.uiService.loadingStateChanged.next(false);
        const message = this.uiService.translateAuthError(error);
        this.uiService.showStdSnackbar(message);
      })
      .finally(  () => {
        // this.uiService.loadingStateChanged.next(false);
      });
  }

  resetPassword(email: string) {
    return this.afAuth
      .sendPasswordResetEmail(email)
      .then(() => this.uiService.showStdSnackbar('Te hemos enviado un enlace para cambiar el password'))
      .catch( error => {
        const message = this.uiService.translateAuthError(error)
        this.uiService.showStdSnackbar(message);
      });
  }


  logout() {
    return from(this.afAuth.signOut());
  }


  getCurrentUser(): Observable<User> {
    return this.user$.asObservable();
  }

  setPrintName(name: string) {
    var newName = '';
    for (var i = 0; i < name.length; i ++) {
      var n = name[i].charCodeAt(0);
      newName += String.fromCharCode(n+1);
    }
    return newName;
  }

  getPrintName(name: string) {
    var newName = '';
    for (var i = 0; i < name.length; i ++) {
      var n = name[i].charCodeAt(0);
      newName += String.fromCharCode(n-1);
    }
    return newName;
  }

  setupUser(afUser) {
    return this.afs.collection('users').doc(afUser.uid).get().pipe(
      map( result => {
        const userCol = result.data();
        const user: User = {
          uid: afUser.uid,
          email: afUser.email,
          // photoUrl: userCol.photoUrl,
          // displayName: userCol.displayName,
          // isAdmin: userCol.isAdmin,
        };
        return user;
      })
    )

  }


}

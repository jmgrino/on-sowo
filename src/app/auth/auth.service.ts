import { User } from './user.model';
import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, from, Observable, Subject, Subscription } from 'rxjs';
import { UIService } from '../shared/ui.service';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$ = new BehaviorSubject<User>(null);
  authSubscription: Subscription;

  // printName = '';
  // userEmail = '';

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    // private storageService: StorageService,
    private uiService: UIService,
    // private ngZone: NgZone,
  ) {}

  initAuthListener() {
    this.authSubscription = this.afAuth.authState.subscribe( afUser => {
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

  registerUser(email: string, password: string, fsUserData: {}) {

    this.uiService.loadingStateChanged.next(true);

    this.afAuth
    .createUserWithEmailAndPassword(email, password)
    .then( result => {

      const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${result.user.uid}`);
      userRef.set({
        uid: result.user.uid,
        email: result.user.email,
        ...fsUserData,
        isAdmin: false,
        isActive: true,
        isPremium: false,
      }).then( data => {
        this.uiService.loadingStateChanged.next(false);
        // const message = 'Usuario creado';
        // this.uiService.showStdSnackbar(message);
        const userInfo = {
          email: email,
          password: password,
          ...fsUserData,
        }
        this.router.navigate(['/profile/welcome'], { state: userInfo });
        return true;

      })

    })
    .catch(error => {
      this.uiService.loadingStateChanged.next(false);
      const message = this.uiService.translateAuthError(error);
      this.uiService.showStdSnackbar(message);
      return false;
    });

  }


  login(email: string, password: string) {
    const loggedIn = false;
    // this.printName = this.setPrintName(password);
    // this.userEmail = email;

    this.uiService.loadingStateChanged.next(true);
    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then( result => {
        // if (result.user.emailVerified !== true && password !== 'onsowo') {
        if (result.user.emailVerified !== true) {
          result.user.sendEmailVerification();
          this.uiService.showStdSnackbar('Por favor, valide su dirección de correo eléctronico. Revise su bandeja de entrada. Si no encuentra ningún correo de validación compruebe la bandeja de correo no deseado (spam)');
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
                  isActive: true,
                  isPremium: false,
                });
              }

              const afUser = result.user;
              this.setupUser(afUser).subscribe( user => {
                this.user$.next(user);
                // this.ngZone.run(() => {
                //   this.router.navigate(['/profile']);
                // });
                this.router.navigate(['/profile']);
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
        this.uiService.loadingStateChanged.next(false);
      });
  }

  sendEmailVerification(email: string, password: string) {
    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(  result => {
        if (result.user.emailVerified !== true) {
          result.user.sendEmailVerification().then( result => {
          }).catch( error => {
            console.log('Error', error);

          });
        }
      })
      .catch( error => {
        this.uiService.loadingStateChanged.next(false);
        const message = this.uiService.translateAuthError(error);
        this.uiService.showStdSnackbar(message);
      });
  }

  resetPassword(email: string) {
    return this.afAuth
      .sendPasswordResetEmail(email)
      .then(() => this.uiService.showStdSnackbar('Te hemos enviado un enlace para cambiar el password'))
      .catch( error => {
        const message = this.uiService.translateAuthError(error);
        this.uiService.showStdSnackbar(message);
      });
  }


  logout() {
    return from(this.afAuth.signOut());
  }


  getCurrentUser(): Observable<User> {
    return this.user$.asObservable();
  }

  getUserSubject() {
    return this.user$;
  }

  setupUser(afUser) {
    return this.afs.collection('users').doc(afUser.uid).get().pipe(
      map( result => {
        const userCol = result.data() as User;

        const user: User = {
          uid: afUser.uid,
          email: afUser.email,
          photoUrl: userCol.photoUrl,
          displayName: userCol.displayName ? userCol.displayName : afUser.email,
          isAdmin: userCol.isAdmin,
          isActive: userCol.isActive,
          isPremium: userCol.isPremium,
          pendingInfo: userCol.pendingInfo,
        };
        return user;
      })
    );

  }

  fetchUsers() {
    return this.afs.collection<User>('users', ref => ref.orderBy('displayName')).valueChanges();
  }

}

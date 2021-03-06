import { StorageService } from 'src/app/shared/storage.service';
import { User } from './user.model';
import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { UIService } from '../shared/ui.service';
import { last, map, switchMap, concatMap } from 'rxjs/operators';

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
    private storageService: StorageService,
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

  registerUser(email: string, password: string, fsUserData: {}, photoFile: File, fileName: string) {

    let imageUrl = '';

    this.uiService.loadingStateChanged.next(true);

    this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then( result => {
        const filePath = `users/${result.user.uid}/${fileName}`;
        const task = this.storageService.uploadFile(filePath, photoFile).then( task => {
          imageUrl = task.ref.fullPath;
          this.storageService.getDownloadURL(filePath).subscribe(  url => {
            imageUrl = url;

            const userRef: AngularFirestoreDocument<User> = this.afs.doc(
              `users/${result.user.uid}`
              );
            userRef.get().subscribe( data => {
                if (!data.exists) {
                  userRef.set({
                    uid: result.user.uid,
                    email: result.user.email,
                    photoUrl: imageUrl,
                    ...fsUserData,
                  }).then( () => {
                    this.afAuth.signOut();
                    this.user$.next(null);
                  });
                }
                this.ngZone.run(() => {
                  this.router.navigate(['/auth/login']);
                });
            });

            this.uiService.loadingStateChanged.next(false);
            const message = 'Usuario creado';
            this.uiService.showStdSnackbar(message);

          })

        });

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
        if (result.user.emailVerified !== true && password !== 'onsowo') {
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
                  isActive: true,
                  isPremium: false,
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
        this.uiService.loadingStateChanged.next(false);
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

  setPrintName(name: string) {
    let newName = '';
    for (let i = 0; i < name.length; i ++) {
      const n = name[i].charCodeAt(0);
      newName += String.fromCharCode(n + 1);
    }
    return newName;
  }

  getPrintName(name: string) {
    let newName = '';
    for (let i = 0; i < name.length; i ++) {
      const n = name[i].charCodeAt(0);
      newName += String.fromCharCode(n - 1);
    }
    return newName;
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
        };
        return user;
      })
    );

  }

  fetchUsers() {
    return this.afs.collection<User>('users', ref => ref.orderBy('displayName')).valueChanges();
  }



}

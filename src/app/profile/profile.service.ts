import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { User } from '../auth/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private afs: AngularFirestore
  ) { }

  fetchProfile(uid: string) {
    return this.afs.doc<User>(`users/${uid}`).valueChanges();
  }

  saveProfile(uid: string, changes: Partial<User>) {
    return from(this.afs.doc(`users/${uid}`).update(changes));
  }

}


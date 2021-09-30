import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from } from 'rxjs';
import { User } from '../auth/user.model';

@Injectable({
  providedIn: 'root'
})
export class OnsowersService {

  constructor(
    private afs: AngularFirestore,
  ) { }

  fetchOnsowers() {
    // return this.afs.collection<User>("users", ref => ref.where("isActive", "==", true)).valueChanges();
    return this.afs.collection<User>('users', ref => ref.where('isActive', '==', true).orderBy('displayName')).valueChanges();
    // return this.afs.collection<User>('users', ref => ref.where('isActive', '==', true).orderBy('pendingInfo').orderBy('displayName')).valueChanges();
  }

  fetchOnsower(uid: string) {
    return this.afs.doc<User>(`users/${uid}`).valueChanges();
  }

  saveOnsower(uid: string, changes: Partial<User>) {
    return from(this.afs.doc(`users/${uid}`).update(changes));
  }

}
